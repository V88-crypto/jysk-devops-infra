from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    """Тело запроса регистрации."""

    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    # 72 — максимальная длина пароля для bcrypt
    password: str = Field(min_length=6, max_length=72)
    phone: str | None = Field(default=None, max_length=32)


class UserLogin(BaseModel):
    """Тело запроса логина."""

    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    """Тело запроса обновления токенов и выхода."""

    refresh_token: str


class UserOut(BaseModel):
    """Данные пользователя в ответах API (без хеша пароля)."""

    # from_attributes: схема умеет читать данные прямо из ORM-объекта
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None
    role_id: int
    role: str
    created_at: datetime

    @field_validator("role", mode="before")
    @classmethod
    def role_to_name(cls, value):
        """Подставляет имя роли строкой вместо ORM-объекта Role."""
        return getattr(value, "name", value)


class Token(BaseModel):
    """Ответ с access-токеном."""

    access_token: str
    token_type: str = "bearer"


class TokenPair(Token):
    """Пара токенов: короткоживущий access и долгоживущий refresh."""

    refresh_token: str


class RegisterResponse(TokenPair):
    """Ответ регистрации: пара токенов (авто-логин) + данные пользователя."""

    user: UserOut
