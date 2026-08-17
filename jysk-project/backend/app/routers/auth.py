from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.user import Role, User
from app.schemas.user import RegisterResponse, Token, UserLogin, UserOut, UserRegister

router = APIRouter(prefix="/auth", tags=["auth"])

# Роль, которая выдаётся каждому новому пользователю
DEFAULT_ROLE = "customer"


def get_or_create_default_role(db: Session) -> Role:
    """Возвращает роль customer; при первом обращении создаёт её."""
    role = db.query(Role).filter(Role.name == DEFAULT_ROLE).first()
    if role is None:
        role = Role(name=DEFAULT_ROLE)
        db.add(role)
        db.flush()  # получаем role.id, не завершая транзакцию
    return role


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Регистрация нового пользователя. Сразу возвращает токен (авто-логин)."""
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
    db.commit()
    db.refresh(user)  # подтягиваем Id и CreatedAt, которые выставила БД

    return RegisterResponse(access_token=create_access_token(user.id), user=user)


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Вход по email и паролю. Возвращает JWT-токен."""
    user = db.query(User).filter(User.email == data.email).first()
    # Одно сообщение для «нет пользователя» и «неверный пароль»,
    # чтобы не раскрывать, какие email зарегистрированы
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return Token(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    """Данные текущего пользователя по JWT-токену."""
    return current_user
