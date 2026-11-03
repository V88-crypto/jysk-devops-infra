from pydantic import BaseModel

from app.schemas.base import Money


class DeliveryMethodOut(BaseModel):
    code: str
    name: str
    price: Money
    base_price: Money
    free_from: Money | None


class DeliveryMethodListOut(BaseModel):
    items: list[DeliveryMethodOut]
    total: int
    page: int
    page_size: int
