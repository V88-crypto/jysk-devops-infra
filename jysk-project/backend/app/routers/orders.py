from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app.core.deps import get_current_user
from app.database import get_db
from app.models.order import Address, Order, OrderItem
from app.models.user import User
from app.schemas.cart import StockIssue
from app.schemas.order import OrderCreate, OrderListOut, OrderOut
from app.services.cart import (
    STOCK_CONFLICT_RESPONSES,
    find_cart,
    load_cart_items,
    stock_conflict,
    touch_cart,
)
from app.services.orders import (
    CANCELLABLE_STATUSES,
    cancel_order,
    create_payment,
    load_order,
    lock_variants,
    orders_to_out,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=OrderListOut)
def list_orders(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Order).filter(Order.user_id == current_user.id)
    total = query.count()
    orders = (
        query.options(selectinload(Order.items))
        .order_by(Order.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return OrderListOut(
        items=orders_to_out(db, orders), total=total, page=page, page_size=page_size
    )


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .options(selectinload(Order.items))
        .first()
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    return orders_to_out(db, [order])[0]


@router.post(
    "",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    responses=STOCK_CONFLICT_RESPONSES,
)
def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = find_cart(db, current_user.id, lock=True)
    items = load_cart_items(db, cart.id, lock=True) if cart is not None else []
    if not items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Кошик порожній")

    variants = lock_variants(db, sorted({item.variant_id for item in items}))
    issues = [
        StockIssue(
            variant_id=item.variant_id,
            sku=variants[item.variant_id].sku,
            requested=item.quantity,
            available=variants[item.variant_id].stock,
        )
        for item in items
        if item.quantity > variants[item.variant_id].stock
    ]
    if issues:
        raise stock_conflict(issues)

    address_id = None
    if data.delivery_method == "courier":
        street = data.address.address
        if data.address.apartment:
            street = f"{street}, {data.address.apartment}"
        address = Address(
            city=data.address.city,
            address=street,
            postal_code=data.address.postal_code,
            provider="courier",
        )
        db.add(address)
        db.flush()
        address_id = address.id

    total_price = sum(
        (variants[item.variant_id].price * item.quantity for item in items), Decimal("0")
    )
    order = Order(
        user_id=current_user.id,
        address_id=address_id,
        status="new",
        total_price=total_price,
        recipient_first_name=data.recipient.first_name,
        recipient_last_name=data.recipient.last_name,
        recipient_phone=data.recipient.phone,
        recipient_email=data.recipient.email,
        delivery_method=data.delivery_method,
        pickup_point=data.pickup_point,
        comment=data.comment,
    )
    db.add(order)
    db.flush()

    for item in items:
        variant = variants[item.variant_id]
        db.add(
            OrderItem(
                order_id=order.id,
                variant_id=variant.id,
                quantity=item.quantity,
                price=variant.price,
            )
        )
        variant.stock -= item.quantity
        db.delete(item)

    db.add(create_payment(order.id, total_price, data.payment_method))
    touch_cart(cart)
    db.commit()

    return orders_to_out(db, [load_order(db, order.id)])[0]


@router.patch("/{order_id}/cancel", response_model=OrderOut)
def cancel_own_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = load_order(db, order_id, user_id=current_user.id, lock=True)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Замовлення не знайдено")
    if order.status not in CANCELLABLE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Це замовлення вже не можна скасувати",
        )

    cancel_order(db, order)
    db.commit()
    return orders_to_out(db, [load_order(db, order_id)])[0]
