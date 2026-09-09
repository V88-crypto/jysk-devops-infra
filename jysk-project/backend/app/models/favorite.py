from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func

from app.database import Base


class Favorite(Base):
    __tablename__ = "Favorites"
    __table_args__ = (UniqueConstraint("UserId", "VariantId", name="ux_Favorites_User_Variant"),)

    id = Column("Id", Integer, primary_key=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
