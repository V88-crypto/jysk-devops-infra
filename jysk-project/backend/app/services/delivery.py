from decimal import ROUND_HALF_UP, Decimal

from app.config import settings
from app.models.order import Address
from app.schemas.delivery import DeliveryMethodOut
from app.schemas.order import OrderCreate

DELIVERY_METHOD_NAMES = {
    "np_courier": "Кур'єр Нової пошти",
    "np_department": "Відділення Нової пошти",
    "pickup": "Самовивіз з магазину JYSK",
}
NOVA_POSHTA = "nova_poshta"


def base_delivery_price(method: str) -> Decimal:
    if method == "np_courier":
        return settings.DELIVERY_PRICE_NP_COURIER
    if method == "np_department":
        return settings.DELIVERY_PRICE_NP_DEPARTMENT
    return Decimal("0")


def free_delivery_from(method: str) -> Decimal | None:
    if method == "pickup":
        return None
    return settings.FREE_DELIVERY_FROM


def delivery_price(method: str, subtotal: Decimal | None = None) -> Decimal:
    threshold = free_delivery_from(method)
    if threshold is not None and subtotal is not None and subtotal >= threshold:
        return Decimal("0")
    return base_delivery_price(method)


def vat_amount(total: Decimal) -> Decimal:
    rate = settings.VAT_RATE
    vat = Decimal(total) * rate / (100 + rate)
    return vat.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def delivery_methods(subtotal: Decimal | None) -> list[DeliveryMethodOut]:
    return [
        DeliveryMethodOut(
            code=code,
            name=name,
            price=delivery_price(code, subtotal),
            base_price=base_delivery_price(code),
            free_from=free_delivery_from(code),
        )
        for code, name in DELIVERY_METHOD_NAMES.items()
    ]


def delivery_address(data: OrderCreate) -> Address | None:
    if data.delivery_method == "np_courier":
        line = f"{data.address.street}, {data.address.house}"
        if data.address.apartment:
            line = f"{line}, кв. {data.address.apartment}"
        return Address(
            provider=NOVA_POSHTA,
            city=data.address.city,
            address=line,
            postal_code=data.address.postal_code,
        )
    if data.delivery_method == "np_department":
        return Address(
            provider=NOVA_POSHTA,
            city=data.department.city,
            external_address_id=str(data.department.number),
            address=f"Відділення №{data.department.number}",
        )
    return None


def department_number(delivery_method: str, address: Address) -> int | None:
    number = address.external_address_id
    if delivery_method != "np_department" or not number or not number.isdigit():
        return None
    return int(number)
