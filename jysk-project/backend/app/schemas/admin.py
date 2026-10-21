from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.base import Money
from app.schemas.catalog import ImageOut
from app.schemas.order import OrderOut as BaseOrderOut
from app.schemas.user import UserOut

OrderStatus = Literal["new", "processing", "shipped", "delivered", "cancelled"]
RoleName = Literal["admin", "customer"]
UploadFolder = Literal["products", "categories", "blog"]


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    parent_id: int | None


class CategoryListOut(BaseModel):
    items: list[CategoryOut]
    total: int
    page: int
    page_size: int


class CategoryIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    parent_id: int | None = None


class AttributeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class AttributeListOut(BaseModel):
    items: list[AttributeOut]
    total: int
    page: int
    page_size: int


class AttributeIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class VariantAttributeIn(BaseModel):
    id: int | None = None
    attribute_id: int | None = None
    name: str | None = Field(default=None, max_length=255)
    value: str = Field(min_length=1, max_length=255)

    @model_validator(mode="after")
    def check_attribute_reference(self):
        if self.attribute_id is None and not self.name:
            raise ValueError("нужно передать attribute_id или name")
        return self


class ImageIn(BaseModel):
    id: int | None = None
    image_url: str = Field(min_length=1, max_length=512)
    is_primary: bool = False
    sort_order: int = 0


class VariantIn(BaseModel):
    id: int | None = None
    sku: str = Field(min_length=1, max_length=64)
    price: Money = Field(ge=0, max_digits=10, decimal_places=2)
    stock: int = Field(default=0, ge=0)
    attributes: list[VariantAttributeIn] = []
    images: list[ImageIn] = []


class ProductIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    category_id: int
    description: str | None = None
    variants: list[VariantIn] = []


class VariantAttributeOut(BaseModel):
    id: int
    attribute_id: int
    name: str
    value: str


class VariantOut(BaseModel):
    id: int
    sku: str
    price: Money
    stock: int
    images: list[ImageOut]
    attributes: list[VariantAttributeOut]


class ProductOut(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: str | None
    created_at: datetime
    variants: list[VariantOut]


class ProductListOut(BaseModel):
    items: list[ProductOut]
    total: int
    page: int
    page_size: int


class ReviewUserOut(BaseModel):
    id: int
    first_name: str
    last_name: str


class ReviewVariantOut(BaseModel):
    id: int
    sku: str
    product_name: str


class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: str | None
    created_at: datetime
    user: ReviewUserOut
    variant: ReviewVariantOut


class ReviewListOut(BaseModel):
    items: list[ReviewOut]
    total: int
    page: int
    page_size: int


class OrderUserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str


class OrderOut(BaseOrderOut):
    user: OrderUserOut


class OrderListOut(BaseModel):
    items: list[OrderOut]
    total: int
    page: int
    page_size: int


class OrderStatusIn(BaseModel):
    status: OrderStatus


class UserListOut(BaseModel):
    items: list[UserOut]
    total: int
    page: int
    page_size: int


class UserRoleIn(BaseModel):
    role: RoleName


class UploadOut(BaseModel):
    key: str
    url: str
