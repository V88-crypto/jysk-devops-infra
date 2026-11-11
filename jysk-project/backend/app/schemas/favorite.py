from datetime import datetime

from pydantic import BaseModel

from app.core.media import OptionalPublicUrl
from app.schemas.base import Money


class FavoriteCreate(BaseModel):
    variant_id: int


class FavoriteVariantOut(BaseModel):
    id: int
    sku: str
    price: Money
    stock: int


class FavoriteProductOut(BaseModel):
    id: int
    name: str
    slug: str


class FavoriteOut(BaseModel):
    id: int
    created_at: datetime
    variant: FavoriteVariantOut
    product: FavoriteProductOut
    image_url: OptionalPublicUrl


class FavoriteListOut(BaseModel):
    items: list[FavoriteOut]
    total: int
    page: int
    page_size: int
