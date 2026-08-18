"""create catalog orders and payments tables

Revision ID: caa7557128e7
Revises: 7e56e4538a41
Create Date: 2026-08-13 21:02:33.840285

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'caa7557128e7'
down_revision: Union[str, Sequence[str], None] = '7e56e4538a41'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "RefreshTokens",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Token", sa.String(length=512), nullable=False),
        sa.Column("ExpiresAt", sa.DateTime(), nullable=False),
        sa.Column("IsRevoked", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
    )
    op.create_index("ix_RefreshTokens_Token", "RefreshTokens", ["Token"], unique=True)

    op.create_table(
        "Categories",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Name", sa.String(length=255), nullable=False),
        sa.Column("Slug", sa.String(length=255), nullable=False),
        sa.Column("ParentId", sa.Integer(), sa.ForeignKey("Categories.Id"), nullable=True),
    )
    op.create_index("ix_Categories_Slug", "Categories", ["Slug"], unique=True)

    op.create_table(
        "Products",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("CategoryId", sa.Integer(), sa.ForeignKey("Categories.Id"), nullable=False),
        sa.Column("Name", sa.String(length=255), nullable=False),
        sa.Column("Slug", sa.String(length=255), nullable=False),
        sa.Column("Description", sa.Text(), nullable=True),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("ix_Products_Slug", "Products", ["Slug"], unique=True)

    op.create_table(
        "ProductVariants",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("ProductId", sa.Integer(), sa.ForeignKey("Products.Id"), nullable=False),
        sa.Column("SKU", sa.String(length=64), nullable=False, unique=True),
        sa.Column("Price", sa.DECIMAL(10, 2), nullable=False),
        sa.Column("Stock", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_table(
        "Attributes",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Name", sa.String(length=255), nullable=False, unique=True),
    )

    op.create_table(
        "VariantAttributes",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column("AttributeId", sa.Integer(), sa.ForeignKey("Attributes.Id"), nullable=False),
        sa.Column("Value", sa.String(length=255), nullable=False),
    )

    op.create_table(
        "Images",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column("ImageUrl", sa.String(length=512), nullable=False),
        sa.Column("IsPrimary", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("SortOrder", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_table(
        "Reviews",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column("Rating", sa.Integer(), nullable=False),
        sa.Column("Comment", sa.Text(), nullable=True),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_table(
        "Addresses",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Provider", sa.String(length=64), nullable=True),
        sa.Column("ExternalCityId", sa.String(length=64), nullable=True),
        sa.Column("ExternalAddressId", sa.String(length=64), nullable=True),
        sa.Column("City", sa.String(length=255), nullable=False),
        sa.Column("Address", sa.String(length=512), nullable=False),
        sa.Column("PostalCode", sa.String(length=16), nullable=True),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_table(
        "Orders",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
        sa.Column("AddressId", sa.Integer(), sa.ForeignKey("Addresses.Id"), nullable=False),
        sa.Column("Status", sa.String(length=32), nullable=False, server_default="new"),
        sa.Column("TotalPrice", sa.DECIMAL(10, 2), nullable=False),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_table(
        "OrderItems",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("OrderId", sa.Integer(), sa.ForeignKey("Orders.Id"), nullable=False),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column("Quantity", sa.Integer(), nullable=False),
        sa.Column("Price", sa.DECIMAL(10, 2), nullable=False),
    )

    op.create_table(
        "Payments",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("OrderId", sa.Integer(), sa.ForeignKey("Orders.Id"), nullable=False),
        sa.Column("Provider", sa.String(length=64), nullable=False),
        sa.Column("PaymentMethod", sa.String(length=64), nullable=True),
        sa.Column("Amount", sa.DECIMAL(10, 2), nullable=False),
        sa.Column("Currency", sa.String(length=8), nullable=False, server_default="RON"),
        sa.Column("Status", sa.String(length=32), nullable=False),
        sa.Column("PaymentToken", sa.String(length=255), nullable=True),
        sa.Column("TransactionId", sa.String(length=255), nullable=True),
        sa.Column("ResponseJson", sa.JSON(), nullable=True),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("PaidAt", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("Payments")
    op.drop_table("OrderItems")
    op.drop_table("Orders")
    op.drop_table("Addresses")
    op.drop_table("Reviews")
    op.drop_table("Images")
    op.drop_table("VariantAttributes")
    op.drop_table("Attributes")
    op.drop_table("ProductVariants")
    op.drop_index("ix_Products_Slug", table_name="Products")
    op.drop_table("Products")
    op.drop_index("ix_Categories_Slug", table_name="Categories")
    op.drop_table("Categories")
    op.drop_index("ix_RefreshTokens_Token", table_name="RefreshTokens")
    op.drop_table("RefreshTokens")
