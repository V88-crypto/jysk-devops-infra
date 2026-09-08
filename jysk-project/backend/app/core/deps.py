from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

ADMIN_ROLE = "admin"


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Достаёт пользователя из access-токена в заголовке Authorization."""
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учётные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise credentials_error
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise credentials_error
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_error
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Пропускает только пользователей с ролью admin."""
    if current_user.role is None or current_user.role.name != ADMIN_ROLE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора",
        )
    return current_user
