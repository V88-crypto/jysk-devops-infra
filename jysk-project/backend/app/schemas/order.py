from datetime import datetime

from pydantic import BaseModel

from app.schemas.base import Money


class OrderAddressOut(BaseModel):
    id: int
    city: str
    address: str
    postal_code: str | None


class OrderItemOut(BaseModel):
    id: int
    variant_id: int
    sku: str
    product_name: str
    quantity: int
    price: Money


class OrderOut(BaseModel):
    id: int
    status: str
    total_price: Money
    created_at: datetime
    address: OrderAddressOut
    items: list[OrderItemOut]


class OrderListOut(BaseModel):
    items: list[OrderOut]
    total: int
    page: int
    page_size: int
