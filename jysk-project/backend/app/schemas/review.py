from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    variant_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    variant_id: int
    rating: int
    comment: str | None
    created_at: datetime


class ReviewVariantOut(BaseModel):
    id: int
    sku: str


class ReviewProductOut(BaseModel):
    id: int
    name: str
    slug: str


class MyReviewOut(BaseModel):
    id: int
    rating: int
    comment: str | None
    created_at: datetime
    variant: ReviewVariantOut
    product: ReviewProductOut
    image_url: str | None


class MyReviewListOut(BaseModel):
    items: list[MyReviewOut]
    total: int
    page: int
    page_size: int


class PublicReviewOut(BaseModel):
    id: int
    rating: int
    comment: str | None
    created_at: datetime
    author: str


class ProductReviewListOut(BaseModel):
    items: list[PublicReviewOut]
    total: int
    page: int
    page_size: int
    average_rating: float
    count: int
