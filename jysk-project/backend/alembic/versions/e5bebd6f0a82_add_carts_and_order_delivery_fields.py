"""add carts and order delivery fields

Revision ID: e5bebd6f0a82
Revises: fee460f97052
Create Date: 2026-10-21 22:18:30.481309

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5bebd6f0a82'
down_revision: Union[str, Sequence[str], None] = 'fee460f97052'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "Carts",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("UserId", sa.Integer(), sa.ForeignKey("Users.Id"), nullable=False),
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
        sa.UniqueConstraint("UserId", name="ux_Carts_UserId"),
    )

    op.create_table(
        "CartItems",
        sa.Column("Id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("CartId", sa.Integer(), sa.ForeignKey("Carts.Id"), nullable=False),
        sa.Column(
            "VariantId", sa.Integer(), sa.ForeignKey("ProductVariants.Id"), nullable=False
        ),
        sa.Column("Quantity", sa.Integer(), nullable=False),
        sa.Column(
            "CreatedAt",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.UniqueConstraint("CartId", "VariantId", name="ux_CartItems_Cart_Variant"),
    )

    with op.batch_alter_table("Orders") as batch_op:
        batch_op.alter_column("AddressId", existing_type=sa.Integer(), nullable=True)
        batch_op.add_column(sa.Column("RecipientFirstName", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("RecipientLastName", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("RecipientPhone", sa.String(length=32), nullable=True))
        batch_op.add_column(sa.Column("RecipientEmail", sa.String(length=255), nullable=True))
        batch_op.add_column(
            sa.Column(
                "DeliveryMethod",
                sa.String(length=16),
                nullable=False,
                server_default="courier",
            )
        )
        batch_op.add_column(sa.Column("PickupPoint", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("Comment", sa.Text(), nullable=True))

    with op.batch_alter_table("Payments") as batch_op:
        batch_op.alter_column(
            "Currency",
            existing_type=sa.String(length=8),
            existing_nullable=False,
            server_default="UAH",
        )


def downgrade() -> None:
    with op.batch_alter_table("Payments") as batch_op:
        batch_op.alter_column(
            "Currency",
            existing_type=sa.String(length=8),
            existing_nullable=False,
            server_default="RON",
        )

    with op.batch_alter_table("Orders") as batch_op:
        batch_op.drop_column("Comment")
        batch_op.drop_column("PickupPoint")
        batch_op.drop_column("DeliveryMethod")
        batch_op.drop_column("RecipientEmail")
        batch_op.drop_column("RecipientPhone")
        batch_op.drop_column("RecipientLastName")
        batch_op.drop_column("RecipientFirstName")
        batch_op.alter_column("AddressId", existing_type=sa.Integer(), nullable=False)

    op.drop_table("CartItems")
    op.drop_table("Carts")
