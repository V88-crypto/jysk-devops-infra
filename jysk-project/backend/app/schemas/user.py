from datetime import datetime

import email_validator
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

if "local" in email_validator.SPECIAL_USE_DOMAIN_NAMES:
    email_validator.SPECIAL_USE_DOMAIN_NAMES.remove("local")


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


class ProfileUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    phone: str | None = Field(default=None, max_length=32)
    avatar_url: str | None = Field(default=None, max_length=512)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6, max_length=72)


class UserOut(BaseModel):
    """Данные пользователя в ответах API (без хеша пароля)."""

    # from_attributes: схема умеет читать данные прямо из ORM-объекта
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None
    avatar_url: str | None
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
