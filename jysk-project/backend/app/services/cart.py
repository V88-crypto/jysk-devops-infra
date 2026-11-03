from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.models.cart import Cart, CartItem
from app.models.catalog import Image, Product, ProductVariant
from app.schemas.cart import (
    CartItemOut,
    CartOut,
    CartProductOut,
    CartVariantOut,
    StockConflictDetail,
    StockConflictOut,
    StockIssue,
)
from app.services.delivery import vat_amount

STOCK_CONFLICT_RESPONSES = {status.HTTP_409_CONFLICT: {"model": StockConflictOut}}


def stock_conflict(issues: list[StockIssue]) -> HTTPException:
    detail = StockConflictDetail(message="Товару недостатньо на складі", items=issues)
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail.model_dump())


def find_cart(db: Session, user_id: int, lock: bool = False) -> Cart | None:
    query = db.query(Cart).filter(Cart.user_id == user_id)
    if lock:
        query = query.with_for_update()
    return query.first()


def get_or_create_cart(db: Session, user_id: int, lock: bool = False) -> Cart:
    cart = find_cart(db, user_id, lock)
    if cart is not None:
        return cart
    try:
        with db.begin_nested():
            cart = Cart(user_id=user_id)
            db.add(cart)
        return cart
    except IntegrityError:
        return find_cart(db, user_id, lock=True)


def load_cart_items(db: Session, cart_id: int, lock: bool = False) -> list[CartItem]:
    query = db.query(CartItem).filter(CartItem.cart_id == cart_id).order_by(CartItem.id)
    if lock:
        query = query.with_for_update()
    return query.all()


def find_cart_item(db: Session, cart_id: int, variant_id: int) -> CartItem | None:
    return (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart_id, CartItem.variant_id == variant_id)
        .with_for_update()
        .first()
    )


def touch_cart(cart: Cart) -> None:
    cart.updated_at = func.now()


def cart_to_out(db: Session, items: list[CartItem]) -> CartOut:
    variant_ids = [item.variant_id for item in items]
    cards = {}
    images = {}
    if variant_ids:
        cards = {
            variant.id: (variant, product)
            for variant, product in db.query(ProductVariant, Product)
            .join(Product, ProductVariant.product_id == Product.id)
            .filter(ProductVariant.id.in_(variant_ids))
            .all()
        }
        images = {
            row[0]: row[1]
            for row in db.query(Image.variant_id, Image.image_url)
            .filter(Image.variant_id.in_(variant_ids), Image.is_primary.is_(True))
            .all()
        }

    result = []
    for item in items:
        variant, product = cards[item.variant_id]
        result.append(
            CartItemOut(
                variant=CartVariantOut(
                    id=variant.id,
                    sku=variant.sku,
                    price=variant.price,
                    stock=variant.stock,
                ),
                product=CartProductOut(id=product.id, name=product.name, slug=product.slug),
                image_url=images.get(variant.id),
                quantity=item.quantity,
                line_total=variant.price * item.quantity,
                available=variant.stock >= item.quantity,
            )
        )

    subtotal = sum((item.line_total for item in result), Decimal("0"))
    return CartOut(
        items=result,
        total_items=sum(item.quantity for item in result),
        subtotal=subtotal,
        vat_amount=vat_amount(subtotal),
        free_delivery_from=settings.FREE_DELIVERY_FROM,
        has_unavailable=any(not item.available for item in result),
    )
