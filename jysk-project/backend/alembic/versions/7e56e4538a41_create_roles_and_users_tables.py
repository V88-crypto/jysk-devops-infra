"""create roles and users tables

Revision ID: 7e56e4538a41
Revises: 
Create Date: 2026-08-07 01:14:16.613630

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e56e4538a41'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Создаёт таблицы Roles и Users."""
    op.create_table(
        "Roles",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Name", sa.String(length=50), nullable=False, unique=True),
    )
    op.create_table(
        "Users",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("FirstName", sa.String(length=100), nullable=False),
        sa.Column("LastName", sa.String(length=100), nullable=False),
        sa.Column("Email", sa.String(length=255), nullable=False),
        sa.Column("PasswordHash", sa.String(length=255), nullable=False),
        sa.Column("Phone", sa.String(length=32), nullable=True),
        sa.Column("RoleId", sa.Integer(), sa.ForeignKey("Roles.Id"), nullable=False),
        # Даты выставляет БД: DEFAULT CURRENT_TIMESTAMP
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "UpdatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    # Уникальный индекс по email — для быстрого поиска и запрета дублей
    op.create_index("ix_Users_Email", "Users", ["Email"], unique=True)


def downgrade() -> None:
    """Откат: удаляет таблицы в обратном порядке (сначала зависимую Users)."""
    op.drop_index("ix_Users_Email", table_name="Users")
    op.drop_table("Users")
    op.drop_table("Roles")
