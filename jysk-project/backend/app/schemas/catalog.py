from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    children: list["CategoryOut"] = []


class ProductListItem(BaseModel):
    id: int
    name: str
    slug: str
    price_from: Decimal | None
    image_url: str | None


class ProductListOut(BaseModel):
    items: list[ProductListItem]
    total: int
    page: int
    page_size: int


class ImageOut(BaseModel):
    id: int
    image_url: str
    is_primary: bool
    sort_order: int


class VariantAttributeOut(BaseModel):
    name: str
    value: str


class VariantOut(BaseModel):
    id: int
    sku: str
    price: Decimal
    stock: int
    images: list[ImageOut]
    attributes: list[VariantAttributeOut]


class ProductDetailOut(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: str | None
    created_at: datetime
    variants: list[VariantOut]
