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
    ProductSuggestOut,
    VariantAttributeOut,
    VariantOut,
)
from app.services.search import search as smart_search

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


def filter_by_category(db: Session, query, category: str | None):
    if category is None:
        return query
    category_obj = db.query(Category).filter(Category.slug == category).first()
    if category_obj is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Категория не найдена")
    return query.filter(Product.category_id.in_(collect_category_ids(db, category_obj)))


def load_list_items(db: Session, ids: list[int]) -> list[ProductListItem]:
    if not ids:
        return []
    products = (
        db.query(Product)
        .filter(Product.id.in_(ids))
        .options(selectinload(Product.variants).selectinload(ProductVariant.images))
        .all()
    )
    by_id = {product.id: product for product in products}
    return [to_list_item(by_id[product_id]) for product_id in ids if product_id in by_id]


def to_list_item(product: Product) -> ProductListItem:
    variants = sorted(product.variants, key=lambda variant: variant.id)
    price_from = min((variant.price for variant in variants), default=None)
    image_url = None
    if variants:
        primary = next((image for image in variants[0].images if image.is_primary), None)
        if primary is not None:
            image_url = primary.image_url
    return ProductListItem(
        id=product.id,
        name=product.name,
        slug=product.slug,
        price_from=price_from,
        image_url=image_url,
    )


@router.get("/products", response_model=ProductListOut)
def get_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = filter_by_category(db, db.query(Product), category)

    if search is not None and search.strip():
        rows = [(row.id, row.name) for row in query.with_entities(Product.id, Product.name)]
        result = smart_search(search, rows)
        start = (page - 1) * page_size
        return ProductListOut(
            items=load_list_items(db, result.ids[start : start + page_size]),
            total=len(result.ids),
            page=page,
            page_size=page_size,
            did_you_mean=result.did_you_mean,
        )

    total = query.count()
    ids = [
        row.id
        for row in query.with_entities(Product.id)
        .order_by(Product.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
    ]
    return ProductListOut(
        items=load_list_items(db, ids), total=total, page=page, page_size=page_size
    )


@router.get("/products/suggest", response_model=ProductSuggestOut)
def suggest_products(
    q: str = Query(default="", max_length=100),
    limit: int = Query(default=8, ge=1, le=20),
    db: Session = Depends(get_db),
):
    if len(q.strip()) < 2:
        return ProductSuggestOut(items=[])
    rows = [(row.id, row.name) for row in db.query(Product.id, Product.name)]
    result = smart_search(q, rows)
    return ProductSuggestOut(
        items=load_list_items(db, result.ids[:limit]), did_you_mean=result.did_you_mean
    )


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