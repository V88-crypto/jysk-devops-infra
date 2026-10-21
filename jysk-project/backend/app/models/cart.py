from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func

from app.database import Base


class Cart(Base):
    __tablename__ = "Carts"
    __table_args__ = (UniqueConstraint("UserId", name="ux_Carts_UserId"),)

    id = Column("Id", Integer, primary_key=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        "UpdatedAt", DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )


class CartItem(Base):
    __tablename__ = "CartItems"
    __table_args__ = (UniqueConstraint("CartId", "VariantId", name="ux_CartItems_Cart_Variant"),)

    id = Column("Id", Integer, primary_key=True)
    cart_id = Column("CartId", Integer, ForeignKey("Carts.Id"), nullable=False)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    quantity = Column("Quantity", Integer, nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
