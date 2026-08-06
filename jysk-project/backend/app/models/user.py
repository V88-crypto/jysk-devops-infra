from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base

# Имена таблиц и колонок — по утверждённой схеме БД (PascalCase).
# Первый аргумент Column — имя колонки в БД, атрибуты в Python — snake_case.


class Role(Base):
    """Роль пользователя (customer, admin и т.д.)."""

    __tablename__ = "Roles"

    id = Column("Id", Integer, primary_key=True)
    name = Column("Name", String(50), unique=True, nullable=False)

    # Все пользователи с этой ролью
    users = relationship("User", back_populates="role")


class User(Base):
    """Пользователь магазина."""

    __tablename__ = "Users"

    id = Column("Id", Integer, primary_key=True)
    first_name = Column("FirstName", String(100), nullable=False)
    last_name = Column("LastName", String(100), nullable=False)
    email = Column("Email", String(255), unique=True, index=True, nullable=False)
    password_hash = Column("PasswordHash", String(255), nullable=False)
    phone = Column("Phone", String(32), nullable=True)
    role_id = Column("RoleId", Integer, ForeignKey("Roles.Id"), nullable=False)
    # Даты выставляет сама БД: func.now() -> CURRENT_TIMESTAMP
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        "UpdatedAt", DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    role = relationship("Role", back_populates="users")
