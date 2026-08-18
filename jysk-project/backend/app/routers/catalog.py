from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.catalog import Category, Product, ProductVariant, VariantAttribute
from app.schemas.catalog import (
    CategoryOut,
    ImageOut,
    ProductDetailOut,
    ProductListItem,
    ProductListOut,
    VariantAttributeOut,
    VariantOut,
)

router = APIRouter(tags=["catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return (
        db.query(Category)
        .filter(Category.parent_id.is_(None))
        .options(selectinload(Category.children).selectinload(Category.children))
        .order_by(Category.id)
        .all()
    )


def collect_category_ids(db: Session, root: Category) -> list[int]:
    ids = [root.id]
    frontier = [root.id]
    while frontier:
        rows = db.query(Category.id).filter(Category.parent_id.in_(frontier)).all()
        frontier = [row.id for row in rows]
        ids.extend(frontier)
    return ids


@router.get("/products", response_model=ProductListOut)
def get_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if category is not None:
        category_obj = db.query(Category).filter(Category.slug == category).first()
        if category_obj is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Категория не найдена"
            )
        query = query.filter(Product.category_id.in_(collect_category_ids(db, category_obj)))
    if search is not None:
        query = query.filter(Product.name.like(f"%{search}%"))

    total = query.count()
    products = (
        query.options(selectinload(Product.variants).selectinload(ProductVariant.images))
        .order_by(Product.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for product in products:
        variants = sorted(product.variants, key=lambda variant: variant.id)
        price_from = min((variant.price for variant in variants), default=None)
        image_url = None
        if variants:
            primary = next((image for image in variants[0].images if image.is_primary), None)
            if primary is not None:
                image_url = primary.image_url
        items.append(
            ProductListItem(
                id=product.id,
                name=product.name,
                slug=product.slug,
                price_from=price_from,
                image_url=image_url,
            )
        )

    return ProductListOut(items=items, total=total, page=page, page_size=page_size)


@router.get("/products/{slug}", response_model=ProductDetailOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .filter(Product.slug == slug)
        .options(
            selectinload(Product.variants).selectinload(ProductVariant.images),
            selectinload(Product.variants)
            .selectinload(ProductVariant.attributes)
            .selectinload(VariantAttribute.attribute),
        )
        .first()
    )
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Товар не найден")

    variants = []
    for variant in sorted(product.variants, key=lambda variant: variant.id):
        images = [
            ImageOut(
                id=image.id,
                image_url=image.image_url,
                is_primary=image.is_primary,
                sort_order=image.sort_order,
            )
            for image in sorted(variant.images, key=lambda image: image.sort_order)
        ]
        attributes = [
            VariantAttributeOut(name=variant_attribute.attribute.name, value=variant_attribute.value)
            for variant_attribute in variant.attributes
        ]
        variants.append(
            VariantOut(
                id=variant.id,
                sku=variant.sku,
                price=variant.price,
                stock=variant.stock,
                images=images,
                attributes=attributes,
            )
        )

    return ProductDetailOut(
        id=product.id,
        category_id=product.category_id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        created_at=product.created_at,
        variants=variants,
    )
