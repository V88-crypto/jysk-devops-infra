from sqlalchemy import (
    DECIMAL,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    __tablename__ = "Categories"

    id = Column("Id", Integer, primary_key=True)
    name = Column("Name", String(255), nullable=False)
    slug = Column("Slug", String(255), unique=True, index=True, nullable=False)
    parent_id = Column("ParentId", Integer, ForeignKey("Categories.Id"), nullable=True)

    children = relationship("Category")
    products = relationship("Product")


class Product(Base):
    __tablename__ = "Products"

    id = Column("Id", Integer, primary_key=True)
    category_id = Column("CategoryId", Integer, ForeignKey("Categories.Id"), nullable=False)
    name = Column("Name", String(255), nullable=False)
    slug = Column("Slug", String(255), unique=True, index=True, nullable=False)
    description = Column("Description", Text, nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())

    variants = relationship("ProductVariant")


class ProductVariant(Base):
    __tablename__ = "ProductVariants"

    id = Column("Id", Integer, primary_key=True)
    product_id = Column("ProductId", Integer, ForeignKey("Products.Id"), nullable=False)
    sku = Column("SKU", String(64), unique=True, nullable=False)
    price = Column("Price", DECIMAL(10, 2), nullable=False)
    stock = Column("Stock", Integer, nullable=False, server_default=text("0"))
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())

    images = relationship("Image", cascade="all, delete-orphan")
    attributes = relationship("VariantAttribute")


class Attribute(Base):
    __tablename__ = "Attributes"

    id = Column("Id", Integer, primary_key=True)
    name = Column("Name", String(255), unique=True, nullable=False)


class VariantAttribute(Base):
    __tablename__ = "VariantAttributes"

    id = Column("Id", Integer, primary_key=True)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    attribute_id = Column("AttributeId", Integer, ForeignKey("Attributes.Id"), nullable=False)
    value = Column("Value", String(255), nullable=False)

    attribute = relationship("Attribute")


class Image(Base):
    __tablename__ = "Images"

    id = Column("Id", Integer, primary_key=True)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    image_url = Column("ImageUrl", String(512), nullable=False)
    is_primary = Column("IsPrimary", Boolean, nullable=False, server_default=text("0"))
    sort_order = Column("SortOrder", Integer, nullable=False, server_default=text("0"))
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
