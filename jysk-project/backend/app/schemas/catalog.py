from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.media import OptionalPublicUrl, PublicUrl
from app.schemas.base import Money


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
    price_from: Money | None
    image_url: OptionalPublicUrl


class ProductListOut(BaseModel):
    items: list[ProductListItem]
    total: int
    page: int
    page_size: int
    did_you_mean: str | None = None


class ProductSuggestOut(BaseModel):
    items: list[ProductListItem]
    did_you_mean: str | None = None


class ImageOut(BaseModel):
    id: int
    image_url: PublicUrl
    is_primary: bool
    sort_order: int


class VariantAttributeOut(BaseModel):
    name: str
    value: str


class VariantOut(BaseModel):
    id: int
    sku: str
    price: Money
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