from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.catalog import Image, Product, ProductVariant
from app.models.favorite import Favorite
from app.models.user import User
from app.schemas.favorite import (
    FavoriteCreate,
    FavoriteListOut,
    FavoriteOut,
    FavoriteProductOut,
    FavoriteVariantOut,
)

router = APIRouter(prefix="/favorites", tags=["favorites"])


def favorites_to_out(db: Session, favorites: list[Favorite]) -> list[FavoriteOut]:
    variant_ids = [favorite.variant_id for favorite in favorites]
    if not variant_ids:
        return []

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
    for favorite in favorites:
        variant, product = cards[favorite.variant_id]
        result.append(
            FavoriteOut(
                id=favorite.id,
                created_at=favorite.created_at,
                variant=FavoriteVariantOut(
                    id=variant.id,
                    sku=variant.sku,
                    price=variant.price,
                    stock=variant.stock,
                ),
                product=FavoriteProductOut(id=product.id, name=product.name, slug=product.slug),
                image_url=images.get(variant.id),
            )
        )
    return result


@router.get("", response_model=FavoriteListOut)
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.id.desc())
        .all()
    )
    items = favorites_to_out(db, favorites)
    return FavoriteListOut(items=items, total=len(items), page=1, page_size=len(items))


@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
def add_favorite(
    data: FavoriteCreate,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    variant = db.query(ProductVariant).filter(ProductVariant.id == data.variant_id).first()
    if variant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Вариант товара не найден"
        )

    favorite = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.variant_id == data.variant_id)
        .first()
    )
    if favorite is None:
        favorite = Favorite(user_id=current_user.id, variant_id=data.variant_id)
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
    else:
        response.status_code = status.HTTP_200_OK

    return favorites_to_out(db, [favorite])[0]


@router.delete("/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    variant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.variant_id == variant_id)
        .first()
    )
    if favorite is not None:
        db.delete(favorite)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
