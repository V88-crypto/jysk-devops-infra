from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.cart import CartItem
from app.models.catalog import ProductVariant
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartOut, StockIssue
from app.services.cart import (
    STOCK_CONFLICT_RESPONSES,
    cart_to_out,
    find_cart_item,
    get_or_create_cart,
    load_cart_items,
    stock_conflict,
    touch_cart,
)

router = APIRouter(prefix="/cart", tags=["cart"])


def current_cart_out(db: Session, cart_id: int) -> CartOut:
    return cart_to_out(db, load_cart_items(db, cart_id))


@router.get("", response_model=CartOut)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = get_or_create_cart(db, current_user.id)
    db.commit()
    return current_cart_out(db, cart.id)


@router.post("/items", response_model=CartOut, responses=STOCK_CONFLICT_RESPONSES)
def add_cart_item(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    variant = db.query(ProductVariant).filter(ProductVariant.id == data.variant_id).first()
    if variant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Товар не знайдено"
        )

    cart = get_or_create_cart(db, current_user.id, lock=True)
    item = find_cart_item(db, cart.id, variant.id)
    quantity = data.quantity + (item.quantity if item is not None else 0)
    if quantity > variant.stock:
        raise stock_conflict(
            [
                StockIssue(
                    variant_id=variant.id,
                    sku=variant.sku,
                    requested=quantity,
                    available=variant.stock,
                )
            ]
        )

    if item is None:
        db.add(CartItem(cart_id=cart.id, variant_id=variant.id, quantity=quantity))
    else:
        item.quantity = quantity
    touch_cart(cart)
    db.commit()
    return current_cart_out(db, cart.id)


@router.patch(
    "/items/{variant_id}", response_model=CartOut, responses=STOCK_CONFLICT_RESPONSES
)
def update_cart_item(
    variant_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = get_or_create_cart(db, current_user.id, lock=True)
    item = find_cart_item(db, cart.id, variant_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Цього товару немає в кошику"
        )

    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).one()
    if data.quantity > variant.stock:
        raise stock_conflict(
            [
                StockIssue(
                    variant_id=variant.id,
                    sku=variant.sku,
                    requested=data.quantity,
                    available=variant.stock,
                )
            ]
        )

    item.quantity = data.quantity
    touch_cart(cart)
    db.commit()
    return current_cart_out(db, cart.id)


@router.delete("/items/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    variant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = get_or_create_cart(db, current_user.id, lock=True)
    item = find_cart_item(db, cart.id, variant_id)
    if item is not None:
        db.delete(item)
        touch_cart(cart)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = get_or_create_cart(db, current_user.id, lock=True)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete(synchronize_session=False)
    touch_cart(cart)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
