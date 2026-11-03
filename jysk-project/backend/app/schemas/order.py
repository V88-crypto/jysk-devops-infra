import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from pydantic_core import PydanticCustomError

from app.core.pickup_points import find_pickup_point
from app.schemas.base import Money

DeliveryMethod = Literal["np_courier", "np_department", "pickup"]
PaymentMethod = Literal["cash_on_delivery", "card"]

PHONE_SEPARATORS = re.compile(r"[\s()-]")
UA_PHONE = re.compile(r"(?:\+?380|0)([0-9]{9})")

DELIVERY_DETAILS = {
    "np_courier": "address",
    "np_department": "department",
    "pickup": "pickup_point",
}
MISSING_DETAIL = {
    "address": ("address_required", "Для доставки кур'єром потрібно вказати адресу"),
    "department": (
        "department_required",
        "Для доставки у відділення потрібно вказати місто та номер відділення",
    ),
    "pickup_point": ("pickup_point_required", "Для самовивозу потрібно обрати пункт видачі"),
}
EXTRA_DETAIL = {
    "address": ("address_not_allowed", "Адресу вказують лише для доставки кур'єром"),
    "department": (
        "department_not_allowed",
        "Відділення вказують лише для доставки у відділення Нової пошти",
    ),
    "pickup_point": (
        "pickup_point_not_allowed",
        "Пункт самовивозу вказується лише для самовивозу",
    ),
}


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
    model_config = ConfigDict(str_strip_whitespace=True)

    city: str = Field(min_length=1, max_length=255)
    street: str = Field(min_length=1, max_length=255)
    house: str = Field(min_length=1, max_length=20)
    apartment: str | None = Field(default=None, max_length=20)
    postal_code: str | None = Field(default=None, max_length=16)

    @field_validator("apartment", "postal_code")
    @classmethod
    def empty_to_none(cls, value: str | None) -> str | None:
        return value or None


class DepartmentIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    city: str = Field(min_length=1, max_length=255)
    number: int

    @field_validator("number")
    @classmethod
    def check_number(cls, value: int) -> int:
        if not 1 <= value <= 99999:
            raise PydanticCustomError(
                "department_number_invalid", "Номер відділення має бути від 1 до 99999"
            )
        return value


class OrderCreate(BaseModel):
    recipient: RecipientIn
    delivery_method: DeliveryMethod
    address: AddressIn | None = None
    department: DepartmentIn | None = None
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
        needed = DELIVERY_DETAILS[self.delivery_method]
        if getattr(self, needed) is None:
            raise PydanticCustomError(*MISSING_DETAIL[needed])
        for field in DELIVERY_DETAILS.values():
            if field != needed and getattr(self, field) is not None:
                raise PydanticCustomError(*EXTRA_DETAIL[field])
        if self.pickup_point is not None and find_pickup_point(self.pickup_point) is None:
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
    provider: str | None
    department_number: int | None


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
    items_total: Money
    delivery_price: Money
    total_price: Money
    vat_amount: Money
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
