import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy.orm import Session, selectinload

from app.core.pickup_points import find_pickup_point
from app.models.catalog import Product, ProductVariant
from app.models.order import Address, Order
from app.models.payment import Payment
from app.models.user import User
from app.schemas import admin as admin_schemas
from app.schemas.order import (
    OrderAddressOut,
    OrderItemOut,
    OrderOut,
    PaymentOut,
    RecipientOut,
)
from app.services.delivery import department_number, vat_amount

CANCELLABLE_STATUSES = ("new", "processing")


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def load_order(
    db: Session, order_id: int, user_id: int | None = None, lock: bool = False
) -> Order | None:
    query = db.query(Order).filter(Order.id == order_id).options(selectinload(Order.items))
    if user_id is not None:
        query = query.filter(Order.user_id == user_id)
    if lock:
        query = query.with_for_update()
    return query.first()


def lock_variants(db: Session, variant_ids: list[int]) -> dict[int, ProductVariant]:
    variants = (
        db.query(ProductVariant)
        .filter(ProductVariant.id.in_(variant_ids))
        .order_by(ProductVariant.id)
        .with_for_update()
        .all()
    )
    return {variant.id: variant for variant in variants}


def create_payment(order_id: int, amount: Decimal, method: str) -> Payment:
    if method == "card":
        return Payment(
            order_id=order_id,
            provider="test",
            payment_method=method,
            amount=amount,
            currency="UAH",
            status="paid",
            paid_at=utc_now(),
            transaction_id=f"TEST-{uuid.uuid4().hex}",
        )
    return Payment(
        order_id=order_id,
        provider="manual",
        payment_method=method,
        amount=amount,
        currency="UAH",
        status="pending",
    )


def cancel_order(db: Session, order: Order) -> None:
    variants = lock_variants(db, sorted({item.variant_id for item in order.items}))
    for item in order.items:
        variants[item.variant_id].stock += item.quantity

    order.status = "cancelled"
    payments = db.query(Payment).filter(Payment.order_id == order.id).with_for_update().all()
    for payment in payments:
        if payment.status == "pending":
            payment.status = "cancelled"
        elif payment.status == "paid":
            payment.status = "refunded"


def orders_to_out(db: Session, orders: list[Order], include_user: bool = False) -> list[OrderOut]:
    order_ids = [order.id for order in orders]
    address_ids = {order.address_id for order in orders if order.address_id is not None}
    variant_ids = {item.variant_id for order in orders for item in order.items}

    addresses = {}
    if address_ids:
        addresses = {
            address.id: address
            for address in db.query(Address).filter(Address.id.in_(address_ids))
        }
    variants = {}
    if variant_ids:
        rows = (
            db.query(ProductVariant.id, ProductVariant.sku, Product.name)
            .join(Product, ProductVariant.product_id == Product.id)
            .filter(ProductVariant.id.in_(variant_ids))
            .all()
        )
        variants = {row[0]: (row[1], row[2]) for row in rows}
    payments = {}
    if order_ids:
        for payment in (
            db.query(Payment).filter(Payment.order_id.in_(order_ids)).order_by(Payment.id)
        ):
            payments[payment.order_id] = payment
    users = {}
    if include_user and orders:
        user_ids = {order.user_id for order in orders}
        users = {user.id: user for user in db.query(User).filter(User.id.in_(user_ids))}

    result = []
    for order in orders:
        address = addresses.get(order.address_id)
        payment = payments.get(order.id)
        items = []
        for item in sorted(order.items, key=lambda item: item.id):
            sku, product_name = variants.get(item.variant_id, ("", ""))
            items.append(
                OrderItemOut(
                    id=item.id,
                    variant_id=item.variant_id,
                    sku=sku,
                    product_name=product_name,
                    quantity=item.quantity,
                    price=item.price,
                )
            )

        fields = {
            "id": order.id,
            "status": order.status,
            "items_total": order.items_total,
            "delivery_price": order.delivery_price,
            "total_price": order.total_price,
            "vat_amount": vat_amount(order.total_price),
            "created_at": order.created_at,
            "recipient": RecipientOut(
                first_name=order.recipient_first_name,
                last_name=order.recipient_last_name,
                phone=order.recipient_phone,
                email=order.recipient_email,
            ),
            "delivery_method": order.delivery_method,
            "pickup_point": find_pickup_point(order.pickup_point),
            "address": None
            if address is None
            else OrderAddressOut(
                id=address.id,
                city=address.city,
                address=address.address,
                postal_code=address.postal_code,
                provider=address.provider,
                department_number=department_number(order.delivery_method, address),
            ),
            "comment": order.comment,
            "payment": None
            if payment is None
            else PaymentOut(
                method=payment.payment_method,
                status=payment.status,
                currency=payment.currency,
                paid_at=payment.paid_at,
            ),
            "items": items,
        }

        if include_user:
            user = users[order.user_id]
            result.append(
                admin_schemas.OrderOut(
                    **fields,
                    user=admin_schemas.OrderUserOut(
                        id=user.id,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        email=user.email,
                    ),
                )
            )
        else:
            result.append(OrderOut(**fields))
    return result
