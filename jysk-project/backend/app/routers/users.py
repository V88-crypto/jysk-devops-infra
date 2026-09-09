from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import hash_password, verify_password
from app.database import get_db
from app.models.catalog import Image, Product, ProductVariant
from app.models.review import Review
from app.models.token import RefreshToken
from app.models.user import User
from app.schemas.review import (
    MyReviewListOut,
    MyReviewOut,
    ReviewProductOut,
    ReviewVariantOut,
)
from app.schemas.user import PasswordChange, ProfileUpdate, UserOut

router = APIRouter(prefix="/users", tags=["users"])

REQUIRED_PROFILE_FIELDS = ("first_name", "last_name")


def primary_images(db: Session, variant_ids: list[int]) -> dict[int, str]:
    if not variant_ids:
        return {}
    rows = (
        db.query(Image.variant_id, Image.image_url)
        .filter(Image.variant_id.in_(variant_ids), Image.is_primary.is_(True))
        .all()
    )
    return {row[0]: row[1] for row in rows}


@router.patch("/me", response_model=UserOut)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is None and field in REQUIRED_PROFILE_FIELDS:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"Поле {field} нельзя очистить",
            )
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)


@router.put("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный текущий пароль",
        )

    current_user.password_hash = hash_password(data.new_password)
    db.query(RefreshToken).filter(
        RefreshToken.user_id == current_user.id,
        RefreshToken.is_revoked.is_(False),
    ).update({RefreshToken.is_revoked: True}, synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me/reviews", response_model=MyReviewListOut)
def my_reviews(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total = db.query(Review).filter(Review.user_id == current_user.id).count()
    rows = (
        db.query(Review, ProductVariant, Product)
        .join(ProductVariant, Review.variant_id == ProductVariant.id)
        .join(Product, ProductVariant.product_id == Product.id)
        .filter(Review.user_id == current_user.id)
        .order_by(Review.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    images = primary_images(db, [variant.id for _, variant, _ in rows])
    items = [
        MyReviewOut(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
            variant=ReviewVariantOut(id=variant.id, sku=variant.sku),
            product=ReviewProductOut(id=product.id, name=product.name, slug=product.slug),
            image_url=images.get(variant.id),
        )
        for review, variant, product in rows
    ]
    return MyReviewListOut(items=items, total=total, page=page, page_size=page_size)
