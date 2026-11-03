"""add nova poshta delivery and order totals

Revision ID: a099e40352e8
Revises: aaf64595bad4
Create Date: 2026-11-02 23:51:52.278567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a099e40352e8'
down_revision: Union[str, Sequence[str], None] = 'aaf64595bad4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


orders = sa.table(
    "Orders",
    sa.column("TotalPrice", sa.DECIMAL(10, 2)),
    sa.column("ItemsTotal", sa.DECIMAL(10, 2)),
    sa.column("DeliveryPrice", sa.DECIMAL(10, 2)),
    sa.column("DeliveryMethod", sa.String(length=16)),
)


def upgrade() -> None:
    with op.batch_alter_table("Orders") as batch_op:
        batch_op.add_column(
            sa.Column("ItemsTotal", sa.DECIMAL(10, 2), nullable=False, server_default=sa.text("0"))
        )
        batch_op.add_column(
            sa.Column(
                "DeliveryPrice", sa.DECIMAL(10, 2), nullable=False, server_default=sa.text("0")
            )
        )
        batch_op.alter_column(
            "DeliveryMethod",
            existing_type=sa.String(length=16),
            existing_nullable=False,
            server_default="np_courier",
        )

    op.execute(orders.update().values(ItemsTotal=orders.c.TotalPrice, DeliveryPrice=0))
    op.execute(
        orders.update()
        .where(orders.c.DeliveryMethod == "courier")
        .values(DeliveryMethod="np_courier")
    )


def downgrade() -> None:
    op.execute(
        orders.update()
        .where(orders.c.DeliveryMethod == "np_courier")
        .values(DeliveryMethod="courier")
    )

    with op.batch_alter_table("Orders") as batch_op:
        batch_op.alter_column(
            "DeliveryMethod",
            existing_type=sa.String(length=16),
            existing_nullable=False,
            server_default="courier",
        )
        batch_op.drop_column("DeliveryPrice")
        batch_op.drop_column("ItemsTotal")
