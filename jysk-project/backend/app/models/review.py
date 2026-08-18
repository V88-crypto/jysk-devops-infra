from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text, func

from app.database import Base


class Review(Base):
    __tablename__ = "Reviews"

    id = Column("Id", Integer, primary_key=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    rating = Column("Rating", Integer, nullable=False)
    comment = Column("Comment", Text, nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
