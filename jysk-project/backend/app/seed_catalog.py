"""Fill the catalog with products and illustrations from backend/seed/.

Run inside the backend container (MinIO must be up):
    docker exec jysk_clone_backend python -m app.seed_catalog

Safe to run repeatedly: products and variants are matched by slug and SKU,
images are stored under fixed keys and simply overwritten.
"""

import io
import json
from decimal import Decimal
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.core.storage import ensure_bucket, get_client, public_url
from app.database import SessionLocal
from app.models.catalog import Image, Product, ProductVariant, VariantAttribute
from app.seed import CATEGORY_TREE, get_or_create_attribute, get_or_create_category

SEED_DIR = Path(__file__).resolve().parent.parent / "seed"
IMAGES_DIR = SEED_DIR / "images"
IMAGE_PREFIX = "products/seed"
# Placeholder photos from app/seed.py that the illustrations replace.
PLACEHOLDER_PREFIX = "https://picsum.photos/"


def load_catalog() -> dict:
    with open(SEED_DIR / "catalog.json", encoding="utf-8") as file:
        return json.load(file)


def upload_seed_image(file_name: str) -> str:
    data = (IMAGES_DIR / file_name).read_bytes()
    key = f"{IMAGE_PREFIX}/{file_name}"
    get_client().put_object(
        bucket_name=settings.MINIO_BUCKET,
        object_name=key,
        data=io.BytesIO(data),
        length=len(data),
        content_type="image/png",
    )
    return public_url(key)


def seed_categories(db: Session, extra_categories: list[dict]) -> dict[str, int]:
    tree = CATEGORY_TREE + [
        (item["name"], item["slug"], [(child["name"], child["slug"]) for child in item["children"]])
        for item in extra_categories
    ]
    category_ids = {}
    for name, slug, children in tree:
        root = get_or_create_category(db, name, slug, None)
        for child_name, child_slug in children:
            category_ids[child_slug] = get_or_create_category(db, child_name, child_slug, root.id).id
    return category_ids


def get_or_create_product(db: Session, item: dict, category_ids: dict[str, int]) -> tuple[Product, bool]:
    product = db.query(Product).filter(Product.slug == item["slug"]).first()
    if product is not None:
        return product, False

    product = Product(
        category_id=category_ids[item["category"]],
        name=item["name"],
        slug=item["slug"],
        description=item["description"],
    )
    db.add(product)
    db.flush()
    return product, True


def get_or_create_variant(db: Session, product: Product, data: dict) -> tuple[ProductVariant, bool]:
    variant = db.query(ProductVariant).filter(ProductVariant.sku == data["sku"]).first()
    if variant is not None:
        return variant, False

    variant = ProductVariant(
        product_id=product.id,
        sku=data["sku"],
        price=Decimal(data["price"]),
        stock=data["stock"],
    )
    db.add(variant)
    db.flush()
    for attr_name, value in data["attrs"].items():
        attribute = get_or_create_attribute(db, attr_name)
        db.add(VariantAttribute(variant_id=variant.id, attribute_id=attribute.id, value=value))
    return variant, True


def set_variant_image(db: Session, variant: ProductVariant, image_url: str) -> bool:
    images = db.query(Image).filter(Image.variant_id == variant.id).all()
    custom = [
        image
        for image in images
        if image.image_url != image_url and not image.image_url.startswith(PLACEHOLDER_PREFIX)
    ]
    # Photos uploaded by an admin win over the seed illustration.
    if custom or [image.image_url for image in images] == [image_url]:
        return False

    for image in images:
        db.delete(image)
    db.add(Image(variant_id=variant.id, image_url=image_url, is_primary=True, sort_order=0))
    return True


def seed_catalog(db: Session) -> dict[str, int]:
    stats = {"products": 0, "variants": 0, "images": 0}
    catalog = load_catalog()
    category_ids = seed_categories(db, catalog["categories"])

    for item in catalog["products"]:
        product, created = get_or_create_product(db, item, category_ids)
        stats["products"] += created
        for variant_data in item["variants"]:
            variant, created = get_or_create_variant(db, product, variant_data)
            stats["variants"] += created
            image_url = upload_seed_image(variant_data["image"])
            stats["images"] += set_variant_image(db, variant, image_url)

    return stats


def main() -> None:
    ensure_bucket()
    db = SessionLocal()
    try:
        stats = seed_catalog(db)
        db.commit()
        print(
            "Catalog seed OK:",
            stats["products"], "new products,",
            stats["variants"], "new variants,",
            stats["images"], "images set;",
            db.query(Product).count(), "products in total",
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
