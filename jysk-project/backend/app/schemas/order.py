import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from pydantic_core import PydanticCustomError

from app.core.pickup_points import find_pickup_point
from app.schemas.base import Money

DeliveryMethod = Literal["courier", "pickup"]
PaymentMethod = Literal["cash_on_delivery", "card"]

PHONE_SEPARATORS = re.compile(r"[\s()-]")
UA_PHONE = re.compile(r"(?:\+?380|0)([0-9]{9})")


class RecipientIn(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(examples=["+380501234567"])
    email: EmailStr

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: str) -> str:
        match = UA_PHONE.fullmatch(PHONE_SEPARATORS.sub("", value))
        if match is None:
            raise PydanticCustomError(
                "phone_invalid", "Номер телефону має бути у форматі +380XXXXXXXXX"
            )
        return f"+380{match.group(1)}"


class AddressIn(BaseModel):
    city: str = Field(min_length=1, max_length=255)
    address: str = Field(min_length=1, max_length=400)
    apartment: str | None = Field(default=None, max_length=100)
    postal_code: str | None = Field(default=None, max_length=16)


class OrderCreate(BaseModel):
    recipient: RecipientIn
    delivery_method: DeliveryMethod
    address: AddressIn | None = None
    pickup_point: str | None = None
    payment_method: PaymentMethod
    comment: str | None = Field(default=None, max_length=1000)
    accept_terms: bool = Field(strict=True)

    @field_validator("accept_terms")
    @classmethod
    def check_terms(cls, value: bool) -> bool:
        if not value:
            raise PydanticCustomError("terms_not_accepted", "Потрібно погодитися з умовами покупки")
        return value

    @model_validator(mode="after")
    def check_delivery(self):
        if self.delivery_method == "courier":
            if self.address is None:
                raise PydanticCustomError(
                    "address_required", "Для доставки кур'єром потрібно вказати адресу"
                )
            if self.pickup_point is not None:
                raise PydanticCustomError(
                    "pickup_point_not_allowed",
                    "Пункт самовивозу вказується лише для самовивозу",
                )
            return self

        if self.address is not None:
            raise PydanticCustomError(
                "address_not_allowed", "Для самовивозу адреса не потрібна"
            )
        if self.pickup_point is None:
            raise PydanticCustomError(
                "pickup_point_required", "Для самовивозу потрібно обрати пункт видачі"
            )
        if find_pickup_point(self.pickup_point) is None:
            raise PydanticCustomError("pickup_point_unknown", "Такого пункту самовивозу немає")
        return self


class RecipientOut(BaseModel):
    first_name: str | None
    last_name: str | None
    phone: str | None
    email: str | None


class PickupPointOut(BaseModel):
    code: str
    name: str
    city: str
    address: str
    working_hours: str


class PickupPointListOut(BaseModel):
    items: list[PickupPointOut]
    total: int
    page: int
    page_size: int


class PaymentOut(BaseModel):
    method: str | None
    status: str
    currency: str
    paid_at: datetime | None


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
    recipient: RecipientOut
    delivery_method: str
    pickup_point: PickupPointOut | None
    address: OrderAddressOut | None
    comment: str | None
    payment: PaymentOut | None
    items: list[OrderItemOut]


class OrderListOut(BaseModel):
    items: list[OrderOut]
    total: int
    page: int
    page_size: int
