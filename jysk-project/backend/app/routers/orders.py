from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app.core.deps import get_current_user
from app.database import get_db
from app.models.catalog import Product, ProductVariant
from app.models.order import Address, Order
from app.models.user import User
from app.schemas.order import OrderAddressOut, OrderItemOut, OrderListOut, OrderOut

router = APIRouter(prefix="/orders", tags=["orders"])


def orders_to_out(db: Session, orders: list[Order]) -> list[OrderOut]:
    address_ids = {order.address_id for order in orders}
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

    result = []
    for order in orders:
        address = addresses[order.address_id]
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
        result.append(
            OrderOut(
                id=order.id,
                status=order.status,
                total_price=order.total_price,
                created_at=order.created_at,
                address=OrderAddressOut(
                    id=address.id,
                    city=address.city,
                    address=address.address,
                    postal_code=address.postal_code,
                ),
                items=items,
            )
        )
    return result


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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")
    return orders_to_out(db, [order])[0]
