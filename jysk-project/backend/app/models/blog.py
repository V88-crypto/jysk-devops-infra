from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class BlogCategory(Base):
    __tablename__ = "BlogCategories"
    __table_args__ = (
        UniqueConstraint("Name", name="ux_BlogCategories_Name"),
        UniqueConstraint("Slug", name="ux_BlogCategories_Slug"),
    )

    id = Column("Id", Integer, primary_key=True)
    name = Column("Name", String(100), nullable=False)
    slug = Column("Slug", String(120), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())


class BlogPost(Base):
    __tablename__ = "BlogPosts"
    __table_args__ = (UniqueConstraint("Slug", name="ux_BlogPosts_Slug"),)

    id = Column("Id", Integer, primary_key=True)
    category_id = Column("CategoryId", Integer, ForeignKey("BlogCategories.Id"), nullable=False)
    title = Column("Title", String(255), nullable=False)
    slug = Column("Slug", String(280), nullable=False)
    description = Column("Description", String(500), nullable=True)
    image_url = Column("ImageUrl", String(512), nullable=False)
    image_alt = Column("ImageAlt", String(255), nullable=True)
    keywords = Column("Keywords", JSON, nullable=True)
    is_published = Column("IsPublished", Boolean, nullable=False, server_default=text("1"))
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        "UpdatedAt", DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    category = relationship("BlogCategory")
    blocks = relationship(
        "BlogContentBlock",
        cascade="all, delete-orphan",
        order_by="BlogContentBlock.sort_order",
    )


class BlogContentBlock(Base):
    __tablename__ = "BlogContentBlocks"

    id = Column("Id", Integer, primary_key=True)
    post_id = Column("PostId", Integer, ForeignKey("BlogPosts.Id"), nullable=False)
    type = Column("Type", String(16), nullable=False)
    title = Column("Title", String(255), nullable=True)
    body = Column("Body", Text, nullable=True)
    sort_order = Column("SortOrder", Integer, nullable=False)

    images = relationship(
        "BlogContentBlockImage",
        cascade="all, delete-orphan",
        order_by="BlogContentBlockImage.sort_order",
    )


class BlogContentBlockImage(Base):
    __tablename__ = "BlogContentBlockImages"

    id = Column("Id", Integer, primary_key=True)
    block_id = Column("BlockId", Integer, ForeignKey("BlogContentBlocks.Id"), nullable=False)
    image_url = Column("ImageUrl", String(512), nullable=False)
    sort_order = Column("SortOrder", Integer, nullable=False)
