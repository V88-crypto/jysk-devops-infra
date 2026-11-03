from pydantic import BaseModel, Field

from app.schemas.base import Money


class CartItemAdd(BaseModel):
    variant_id: int
    quantity: int = Field(ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartVariantOut(BaseModel):
    id: int
    sku: str
    price: Money
    stock: int


class CartProductOut(BaseModel):
    id: int
    name: str
    slug: str


class CartItemOut(BaseModel):
    variant: CartVariantOut
    product: CartProductOut
    image_url: str | None
    quantity: int
    line_total: Money
    available: bool


class CartOut(BaseModel):
    items: list[CartItemOut]
    total_items: int
    subtotal: Money
    vat_amount: Money
    free_delivery_from: Money
    has_unavailable: bool


class StockIssue(BaseModel):
    variant_id: int
    sku: str
    requested: int
    available: int


class StockConflictDetail(BaseModel):
    message: str
    items: list[StockIssue]


class StockConflictOut(BaseModel):
    detail: StockConflictDetail
