"""add blog

Revision ID: aaf64595bad4
Revises: e5bebd6f0a82
Create Date: 2026-11-02 21:03:26.610315

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aaf64595bad4'
down_revision: Union[str, Sequence[str], None] = 'e5bebd6f0a82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "BlogCategories",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Name", sa.String(length=100), nullable=False),
        sa.Column("Slug", sa.String(length=120), nullable=False),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.UniqueConstraint("Name", name="ux_BlogCategories_Name"),
        sa.UniqueConstraint("Slug", name="ux_BlogCategories_Slug"),
    )

    op.create_table(
        "BlogPosts",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "CategoryId", sa.Integer(), sa.ForeignKey("BlogCategories.Id"), nullable=False
        ),
        sa.Column("Title", sa.String(length=255), nullable=False),
        sa.Column("Slug", sa.String(length=280), nullable=False),
        sa.Column("Description", sa.String(length=500), nullable=True),
        sa.Column("ImageUrl", sa.String(length=512), nullable=False),
        sa.Column("ImageAlt", sa.String(length=255), nullable=True),
        sa.Column("Keywords", sa.JSON(), nullable=True),
        sa.Column("IsPublished", sa.Boolean(), nullable=False, server_default=sa.text("1")),
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
        sa.UniqueConstraint("Slug", name="ux_BlogPosts_Slug"),
    )

    op.create_table(
        "BlogContentBlocks",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("PostId", sa.Integer(), sa.ForeignKey("BlogPosts.Id"), nullable=False),
        sa.Column("Type", sa.String(length=16), nullable=False),
        sa.Column("Title", sa.String(length=255), nullable=True),
        sa.Column("Body", sa.Text(), nullable=True),
        sa.Column("SortOrder", sa.Integer(), nullable=False),
    )

    op.create_table(
        "BlogContentBlockImages",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "BlockId", sa.Integer(), sa.ForeignKey("BlogContentBlocks.Id"), nullable=False
        ),
        sa.Column("ImageUrl", sa.String(length=512), nullable=False),
        sa.Column("SortOrder", sa.Integer(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("BlogContentBlockImages")
    op.drop_table("BlogContentBlocks")
    op.drop_table("BlogPosts")
    op.drop_table("BlogCategories")
