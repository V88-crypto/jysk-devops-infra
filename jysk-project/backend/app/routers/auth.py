from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.core.deps import get_current_user
from app.core.mailer import send_password_reset_email
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    hash_password,
    hash_password_reset_token,
    hash_refresh_token,
    verify_password,
)
from app.database import get_db
from app.models.token import PasswordResetToken, RefreshToken
from app.models.user import Role, User
from app.schemas.user import (
    ForgotPasswordRequest,
    MessageOut,
    RefreshRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResetTokenValidOut,
    TokenPair,
    UserLogin,
    UserOut,
    UserRegister,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# Роль, которая выдаётся каждому новому пользователю
DEFAULT_ROLE = "customer"

FORGOT_PASSWORD_MESSAGE = (
    "Если такой email зарегистрирован, мы отправили на него ссылку для восстановления пароля"
)
RESET_TOKEN_INVALID_MESSAGE = "Ссылка для восстановления пароля недействительна или устарела"
PASSWORD_RESET_DONE_MESSAGE = "Пароль изменён, войдите с новым паролем"


def utc_now() -> datetime:
    """Текущее время UTC без таймзоны: колонка DATETIME в MySQL хранится без неё."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def get_or_create_default_role(db: Session) -> Role:
    """Возвращает роль customer; при первом обращении создаёт её."""
    role = db.query(Role).filter(Role.name == DEFAULT_ROLE).first()
    if role is None:
        role = Role(name=DEFAULT_ROLE)
        db.add(role)
        db.flush()  # получаем role.id, не завершая транзакцию
    return role


def authenticate_user(db: Session, email: str, password: str) -> User:
    """Проверяет email и пароль, иначе 401."""
    user = db.query(User).filter(User.email == email).first()
    # Одно сообщение для «нет пользователя» и «неверный пароль»,
    # чтобы не раскрывать, какие email зарегистрированы
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def issue_tokens(db: Session, user_id: int) -> TokenPair:
    """Выдаёт пару токенов; в базу пишется только хеш refresh-токена."""
    refresh_token = create_refresh_token()
    db.add(
        RefreshToken(
            token=hash_refresh_token(refresh_token),
            expires_at=utc_now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            user_id=user_id,
        )
    )
    return TokenPair(access_token=create_access_token(user_id), refresh_token=refresh_token)


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Регистрация нового пользователя. Сразу возвращает пару токенов (авто-логин)."""
    # Email должен быть свободен
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует",
        )

    role = get_or_create_default_role(db)
    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=hash_password(data.password),
        phone=data.phone,
        role_id=role.id,
    )
    db.add(user)
    db.flush()
    tokens = issue_tokens(db, user.id)
    db.commit()
    db.refresh(user)  # подтягиваем Id и CreatedAt, которые выставила БД

    return RegisterResponse(
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token,
        user=user,
    )


@router.post("/login", response_model=TokenPair)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Вход по email и паролю. Возвращает пару токенов."""
    user = authenticate_user(db, data.email, data.password)
    tokens = issue_tokens(db, user.id)
    db.commit()
    return tokens


@router.post("/token", response_model=TokenPair)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Вход через OAuth2-форму (username = email) — для кнопки Authorize в Swagger."""
    user = authenticate_user(db, form_data.username, form_data.password)
    tokens = issue_tokens(db, user.id)
    db.commit()
    return tokens


@router.post("/refresh", response_model=TokenPair)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    """Обновление пары токенов с ротацией: старый refresh-токен отзывается."""
    token_record = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == hash_refresh_token(data.refresh_token))
        .first()
    )
    if token_record is None or token_record.is_revoked or token_record.expires_at < utc_now():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный refresh-токен",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_record.is_revoked = True
    tokens = issue_tokens(db, token_record.user_id)
    db.commit()
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    data: RefreshRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Выход: отзывает refresh-токен, если он принадлежит текущему пользователю."""
    token_record = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == hash_refresh_token(data.refresh_token),
            RefreshToken.user_id == current_user.id,
        )
        .first()
    )
    if token_record is not None:
        token_record.is_revoked = True
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    """Данные текущего пользователя по access-токену."""
    return current_user


def find_valid_reset_token(db: Session, raw_token: str) -> PasswordResetToken:
    token_record = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == hash_password_reset_token(raw_token))
        .first()
    )
    if (
        token_record is None
        or token_record.is_revoked
        or token_record.used_at is not None
        or token_record.expires_at < utc_now()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=RESET_TOKEN_INVALID_MESSAGE,
        )
    return token_record


@router.post("/forgot-password", response_model=MessageOut)
def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()
    if user is not None:
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_revoked.is_(False),
        ).update({PasswordResetToken.is_revoked: True}, synchronize_session=False)

        raw_token = create_password_reset_token()
        db.add(
            PasswordResetToken(
                user_id=user.id,
                token_hash=hash_password_reset_token(raw_token),
                expires_at=utc_now()
                + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES),
            )
        )
        db.commit()

        reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password?token={raw_token}"
        background_tasks.add_task(send_password_reset_email, user.email, reset_url)

    return MessageOut(detail=FORGOT_PASSWORD_MESSAGE)


@router.get("/reset-password/validate", response_model=ResetTokenValidOut)
def validate_reset_token(token: str, db: Session = Depends(get_db)):
    find_valid_reset_token(db, token)
    return ResetTokenValidOut(valid=True)


@router.post("/reset-password", response_model=MessageOut)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_record = find_valid_reset_token(db, data.token)
    user = db.query(User).filter(User.id == token_record.user_id).first()

    user.password_hash = hash_password(data.new_password)
    token_record.used_at = utc_now()
    token_record.is_revoked = True
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.is_revoked.is_(False),
    ).update({RefreshToken.is_revoked: True}, synchronize_session=False)
    db.commit()

    return MessageOut(detail=PASSWORD_RESET_DONE_MESSAGE)
