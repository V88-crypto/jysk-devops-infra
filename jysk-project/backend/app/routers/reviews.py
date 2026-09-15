from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.catalog import Product, ProductVariant
from app.models.review import Review
from app.models.user import User
from app.schemas.review import (
    ProductReviewListOut,
    PublicReviewOut,
    ReviewCreate,
    ReviewOut,
)

router = APIRouter(tags=["reviews"])


def author_name(user: User) -> str:
    initial = f" {user.last_name[0]}." if user.last_name else ""
    return f"{user.first_name}{initial}"


@router.post("/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    variant = db.query(ProductVariant).filter(ProductVariant.id == data.variant_id).first()
    if variant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Вариант товара не найден"
        )

    already = (
        db.query(Review)
        .filter(Review.user_id == current_user.id, Review.variant_id == data.variant_id)
        .first()
    )
    if already is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Вы уже оставляли отзыв на этот вариант",
        )

    review = Review(
        user_id=current_user.id,
        variant_id=data.variant_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return ReviewOut(
        id=review.id,
        variant_id=review.variant_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
    )


@router.get("/products/{slug}/reviews", response_model=ProductReviewListOut)
def product_reviews(
    slug: str,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.slug == slug).first()
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден")

    variant_ids = [
        row[0]
        for row in db.query(ProductVariant.id)
        .filter(ProductVariant.product_id == product.id)
        .all()
    ]
    if not variant_ids:
        return ProductReviewListOut(
            items=[], total=0, page=page, page_size=page_size, average_rating=0.0, count=0
        )

    total = db.query(Review).filter(Review.variant_id.in_(variant_ids)).count()
    average = (
        db.query(func.avg(Review.rating)).filter(Review.variant_id.in_(variant_ids)).scalar()
    )
    rows = (
        db.query(Review, User)
        .join(User, Review.user_id == User.id)
        .filter(Review.variant_id.in_(variant_ids))
        .order_by(Review.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [
        PublicReviewOut(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
            author=author_name(user),
        )
        for review, user in rows
    ]
    return ProductReviewListOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        average_rating=round(float(average or 0), 2),
        count=total,
    )
