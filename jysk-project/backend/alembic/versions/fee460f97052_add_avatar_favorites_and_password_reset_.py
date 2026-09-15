"""add avatar favorites and password reset tokens

Revision ID: fee460f97052
Revises: caa7557128e7
Create Date: 2026-09-09 20:33:02.136590

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fee460f97052'
down_revision: Union[str, Sequence[str], None] = 'caa7557128e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("Users", sa.Column("AvatarUrl", sa.String(length=512), nullable=True))

    op.create_table(
        "Favorites",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.UniqueConstraint("UserId", "VariantId", name="ux_Favorites_User_Variant"),
    )

    op.create_table(
        "PasswordResetTokens",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
        sa.Column("TokenHash", sa.String(length=64), nullable=False),
        sa.Column("ExpiresAt", sa.DateTime(), nullable=False),
        sa.Column("UsedAt", sa.DateTime(), nullable=True),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("IsRevoked", sa.Boolean(), nullable=False, server_default=sa.text("0")),
    )
    op.create_index(
        "ix_PasswordResetTokens_TokenHash", "PasswordResetTokens", ["TokenHash"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_PasswordResetTokens_TokenHash", table_name="PasswordResetTokens")
    op.drop_table("PasswordResetTokens")
    op.drop_table("Favorites")
    op.drop_column("Users", "AvatarUrl")
