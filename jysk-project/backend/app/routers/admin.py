import re

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from app.core.deps import ADMIN_ROLE, require_admin
from app.core.storage import public_url, upload_image
from app.core.uploads import read_image_upload
from app.database import get_db
from app.models.catalog import (
    Attribute,
    Category,
    Image,
    Product,
    ProductVariant,
    VariantAttribute,
)
from app.models.order import Address, Order, OrderItem
from app.models.review import Review
from app.models.user import Role, User
from app.schemas.admin import (
    AttributeIn,
    AttributeListOut,
    AttributeOut,
    CategoryIn,
    CategoryListOut,
    CategoryOut,
    ImageIn,
    OrderAddressOut,
    OrderItemOut,
    OrderListOut,
    OrderOut,
    OrderStatusIn,
    OrderUserOut,
    ProductIn,
    ProductListOut,
    ProductOut,
    ReviewListOut,
    ReviewOut,
    ReviewUserOut,
    ReviewVariantOut,
    UploadFolder,
    UploadOut,
    UserListOut,
    UserRoleIn,
    VariantAttributeIn,
    VariantAttributeOut,
    VariantIn,
    VariantOut,
)
from app.schemas.catalog import ImageOut
from app.schemas.user import UserOut

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
)

TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
    "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    "і": "i", "ї": "yi", "є": "ye", "ґ": "g",
}

PRODUCT_OPTIONS = (
    selectinload(Product.variants).selectinload(ProductVariant.images),
    selectinload(Product.variants)
    .selectinload(ProductVariant.attributes)
    .selectinload(VariantAttribute.attribute),
)


def make_slug(name: str) -> str:
    text = "".join(TRANSLIT.get(char, char) for char in name.lower())
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def build_slug(name: str, slug: str | None) -> str:
    result = slug if slug else make_slug(name)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Не удалось составить slug из названия, передайте его явно",
        )
    return result


def conflict(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message)


def not_found(message: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)


def get_or_404(db: Session, model, object_id: int, message: str):
    obj = db.query(model).filter(model.id == object_id).first()
    if obj is None:
        raise not_found(message)
    return obj


@router.get("/categories", response_model=CategoryListOut)
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.id).all()
    items = [CategoryOut.model_validate(category) for category in categories]
    return CategoryListOut(items=items, total=len(items), page=1, page_size=len(items))


def check_category_slug(db: Session, slug: str, exclude_id: int | None = None) -> None:
    query = db.query(Category).filter(Category.slug == slug)
    if exclude_id is not None:
        query = query.filter(Category.id != exclude_id)
    if query.first() is not None:
        raise conflict("Категория с таким slug уже существует")


def check_parent(db: Session, parent_id: int | None, category_id: int | None = None) -> None:
    if parent_id is None:
        return
    ancestor = get_or_404(db, Category, parent_id, "Родительская категория не найдена")
    if category_id is None:
        return
    while ancestor is not None:
        if ancestor.id == category_id:
            raise conflict("Категория не может быть вложена сама в себя")
        if ancestor.parent_id is None:
            return
        ancestor = db.query(Category).filter(Category.id == ancestor.parent_id).first()


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryIn, db: Session = Depends(get_db)):
    slug = build_slug(data.name, data.slug)
    check_category_slug(db, slug)
    check_parent(db, data.parent_id)

    category = Category(name=data.name, slug=slug, parent_id=data.parent_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, data: CategoryIn, db: Session = Depends(get_db)):
    category = get_or_404(db, Category, category_id, "Категория не найдена")
    slug = build_slug(data.name, data.slug)
    check_category_slug(db, slug, exclude_id=category_id)
    check_parent(db, data.parent_id, category_id)

    category.name = data.name
    category.slug = slug
    category.parent_id = data.parent_id
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = get_or_404(db, Category, category_id, "Категория не найдена")
    if db.query(Category).filter(Category.parent_id == category_id).first() is not None:
        raise conflict("Нельзя удалить категорию с подкатегориями")
    if db.query(Product).filter(Product.category_id == category_id).first() is not None:
        raise conflict("Нельзя удалить категорию с товарами")

    db.delete(category)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/attributes", response_model=AttributeListOut)
def list_attributes(db: Session = Depends(get_db)):
    attributes = db.query(Attribute).order_by(Attribute.id).all()
    items = [AttributeOut.model_validate(attribute) for attribute in attributes]
    return AttributeListOut(items=items, total=len(items), page=1, page_size=len(items))


@router.post("/attributes", response_model=AttributeOut, status_code=status.HTTP_201_CREATED)
def create_attribute(data: AttributeIn, db: Session = Depends(get_db)):
    if db.query(Attribute).filter(Attribute.name == data.name).first() is not None:
        raise conflict("Атрибут с таким именем уже существует")

    attribute = Attribute(name=data.name)
    db.add(attribute)
    db.commit()
    db.refresh(attribute)
    return attribute


def variant_to_out(variant: ProductVariant) -> VariantOut:
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
        VariantAttributeOut(
            id=item.id,
            attribute_id=item.attribute_id,
            name=item.attribute.name,
            value=item.value,
        )
        for item in sorted(variant.attributes, key=lambda item: item.id)
    ]
    return VariantOut(
        id=variant.id,
        sku=variant.sku,
        price=variant.price,
        stock=variant.stock,
        images=images,
        attributes=attributes,
    )


def product_to_out(product: Product) -> ProductOut:
    variants = sorted(product.variants, key=lambda variant: variant.id)
    return ProductOut(
        id=product.id,
        category_id=product.category_id,
        name=product.name,
        slug=product.slug,
        description=product.description,
        created_at=product.created_at,
        variants=[variant_to_out(variant) for variant in variants],
    )


def load_product(db: Session, product_id: int) -> Product | None:
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .options(*PRODUCT_OPTIONS)
        .first()
    )


def check_product_slug(db: Session, slug: str, exclude_id: int | None = None) -> None:
    query = db.query(Product).filter(Product.slug == slug)
    if exclude_id is not None:
        query = query.filter(Product.id != exclude_id)
    if query.first() is not None:
        raise conflict("Товар с таким slug уже существует")


def check_sku(db: Session, sku: str, exclude_id: int | None = None) -> None:
    query = db.query(ProductVariant).filter(ProductVariant.sku == sku)
    if exclude_id is not None:
        query = query.filter(ProductVariant.id != exclude_id)
    if query.first() is not None:
        raise conflict(f"Вариант с SKU {sku} уже существует")


def check_unique_skus(variants: list[VariantIn]) -> None:
    skus = [variant.sku for variant in variants]
    if len(set(skus)) != len(skus):
        raise conflict("SKU вариантов повторяются в запросе")


def normalize_images(images: list[ImageIn]) -> None:
    primary_index = next(
        (index for index, image in enumerate(images) if image.is_primary), 0
    )
    for index, image in enumerate(images):
        image.is_primary = index == primary_index


def resolve_attribute(db: Session, data: VariantAttributeIn) -> Attribute:
    if data.attribute_id is not None:
        return get_or_404(db, Attribute, data.attribute_id, "Атрибут не найден")
    attribute = db.query(Attribute).filter(Attribute.name == data.name).first()
    if attribute is None:
        attribute = Attribute(name=data.name)
        db.add(attribute)
        db.flush()
    return attribute


def create_variant(db: Session, product_id: int, data: VariantIn) -> None:
    variant = ProductVariant(
        product_id=product_id,
        sku=data.sku,
        price=data.price,
        stock=data.stock,
    )
    db.add(variant)
    db.flush()

    normalize_images(data.images)
    for image in data.images:
        db.add(
            Image(
                variant_id=variant.id,
                image_url=image.image_url,
                is_primary=image.is_primary,
                sort_order=image.sort_order,
            )
        )
    for attribute_data in data.attributes:
        attribute = resolve_attribute(db, attribute_data)
        db.add(
            VariantAttribute(
                variant_id=variant.id,
                attribute_id=attribute.id,
                value=attribute_data.value,
            )
        )


def sync_images(db: Session, variant: ProductVariant, images: list[ImageIn]) -> None:
    normalize_images(images)
    existing = {image.id: image for image in variant.images}
    incoming_ids = {image.id for image in images if image.id is not None}
    if incoming_ids - set(existing):
        raise not_found("Картинка не найдена у этого варианта")

    for image in list(variant.images):
        if image.id not in incoming_ids:
            db.delete(image)

    for image_data in images:
        if image_data.id is None:
            db.add(
                Image(
                    variant_id=variant.id,
                    image_url=image_data.image_url,
                    is_primary=image_data.is_primary,
                    sort_order=image_data.sort_order,
                )
            )
        else:
            image = existing[image_data.id]
            image.image_url = image_data.image_url
            image.is_primary = image_data.is_primary
            image.sort_order = image_data.sort_order


def sync_attributes(
    db: Session, variant: ProductVariant, attributes: list[VariantAttributeIn]
) -> None:
    existing = {item.id: item for item in variant.attributes}
    incoming_ids = {item.id for item in attributes if item.id is not None}
    if incoming_ids - set(existing):
        raise not_found("Атрибут не найден у этого варианта")

    for item in list(variant.attributes):
        if item.id not in incoming_ids:
            db.delete(item)

    for attribute_data in attributes:
        attribute = resolve_attribute(db, attribute_data)
        if attribute_data.id is None:
            db.add(
                VariantAttribute(
                    variant_id=variant.id,
                    attribute_id=attribute.id,
                    value=attribute_data.value,
                )
            )
        else:
            item = existing[attribute_data.id]
            item.attribute_id = attribute.id
            item.value = attribute_data.value


def update_variant(db: Session, variant: ProductVariant, data: VariantIn) -> None:
    variant.sku = data.sku
    variant.price = data.price
    variant.stock = data.stock
    sync_images(db, variant, data.images)
    sync_attributes(db, variant, data.attributes)


def check_variants_not_ordered(db: Session, variant_ids: list[int]) -> None:
    used = db.query(OrderItem).filter(OrderItem.variant_id.in_(variant_ids)).first()
    if used is not None:
        raise conflict("Нельзя удалить вариант, который уже есть в заказах")


def delete_variants(db: Session, variants: list[ProductVariant]) -> None:
    for variant in variants:
        for item in list(variant.attributes):
            db.delete(item)
        for review in db.query(Review).filter(Review.variant_id == variant.id).all():
            db.delete(review)
        db.delete(variant)


@router.get("/products", response_model=ProductListOut)
def list_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if search is not None:
        query = query.filter(Product.name.like(f"%{search}%"))

    total = query.count()
    products = (
        query.options(*PRODUCT_OPTIONS)
        .order_by(Product.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [product_to_out(product) for product in products]
    return ProductListOut(items=items, total=total, page=page, page_size=page_size)


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = load_product(db, product_id)
    if product is None:
        raise not_found("Товар не найден")
    return product_to_out(product)


@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductIn, db: Session = Depends(get_db)):
    get_or_404(db, Category, data.category_id, "Категория не найдена")
    slug = build_slug(data.name, data.slug)
    check_product_slug(db, slug)
    check_unique_skus(data.variants)
    for variant_data in data.variants:
        check_sku(db, variant_data.sku)

    product = Product(
        category_id=data.category_id,
        name=data.name,
        slug=slug,
        description=data.description,
    )
    db.add(product)
    db.flush()
    for variant_data in data.variants:
        create_variant(db, product.id, variant_data)
    db.commit()

    return product_to_out(load_product(db, product.id))


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, data: ProductIn, db: Session = Depends(get_db)):
    product = load_product(db, product_id)
    if product is None:
        raise not_found("Товар не найден")
    get_or_404(db, Category, data.category_id, "Категория не найдена")
    slug = build_slug(data.name, data.slug)
    check_product_slug(db, slug, exclude_id=product_id)
    check_unique_skus(data.variants)

    existing = {variant.id: variant for variant in product.variants}
    incoming_ids = {variant.id for variant in data.variants if variant.id is not None}
    if incoming_ids - set(existing):
        raise not_found("Вариант не найден у этого товара")

    removed = [variant for variant in product.variants if variant.id not in incoming_ids]
    if removed:
        check_variants_not_ordered(db, [variant.id for variant in removed])
        delete_variants(db, removed)
        db.flush()

    product.name = data.name
    product.slug = slug
    product.description = data.description
    product.category_id = data.category_id

    for variant_data in data.variants:
        if variant_data.id is None:
            check_sku(db, variant_data.sku)
            create_variant(db, product.id, variant_data)
        else:
            check_sku(db, variant_data.sku, exclude_id=variant_data.id)
            update_variant(db, existing[variant_data.id], variant_data)
    db.commit()

    return product_to_out(load_product(db, product_id))


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = load_product(db, product_id)
    if product is None:
        raise not_found("Товар не найден")

    variants = list(product.variants)
    if variants:
        check_variants_not_ordered(db, [variant.id for variant in variants])
        delete_variants(db, variants)
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/reviews", response_model=ReviewListOut)
def list_reviews(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(Review).count()
    rows = (
        db.query(Review, User, ProductVariant, Product)
        .join(User, Review.user_id == User.id)
        .join(ProductVariant, Review.variant_id == ProductVariant.id)
        .join(Product, ProductVariant.product_id == Product.id)
        .order_by(Review.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [
        ReviewOut(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
            user=ReviewUserOut(
                id=user.id, first_name=user.first_name, last_name=user.last_name
            ),
            variant=ReviewVariantOut(id=variant.id, sku=variant.sku, product_name=product.name),
        )
        for review, user, variant, product in rows
    ]
    return ReviewListOut(items=items, total=total, page=page, page_size=page_size)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = get_or_404(db, Review, review_id, "Отзыв не найден")
    db.delete(review)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def orders_to_out(db: Session, orders: list[Order]) -> list[OrderOut]:
    user_ids = {order.user_id for order in orders}
    address_ids = {order.address_id for order in orders}
    variant_ids = {item.variant_id for order in orders for item in order.items}

    users = {}
    if user_ids:
        users = {user.id: user for user in db.query(User).filter(User.id.in_(user_ids))}
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
        user = users[order.user_id]
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
                user=OrderUserOut(
                    id=user.id,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    email=user.email,
                ),
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


@router.get("/orders", response_model=OrderListOut)
def list_orders(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Order)
    if status is not None:
        query = query.filter(Order.status == status)

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


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .options(selectinload(Order.items))
        .first()
    )
    if order is None:
        raise not_found("Заказ не найден")
    return orders_to_out(db, [order])[0]


@router.patch("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, data: OrderStatusIn, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .options(selectinload(Order.items))
        .first()
    )
    if order is None:
        raise not_found("Заказ не найден")

    order.status = data.status
    db.commit()
    db.refresh(order)
    return orders_to_out(db, [order])[0]


@router.get("/users", response_model=UserListOut)
def list_users(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if search is not None:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                User.email.like(pattern),
                User.first_name.like(pattern),
                User.last_name.like(pattern),
            )
        )

    total = query.count()
    users = (
        query.options(selectinload(User.role))
        .order_by(User.id)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    items = [UserOut.model_validate(user) for user in users]
    return UserListOut(items=items, total=total, page=page, page_size=page_size)


@router.patch("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    data: UserRoleIn,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = get_or_404(db, User, user_id, "Пользователь не найден")
    if user.id == current_admin.id and data.role != ADMIN_ROLE:
        raise conflict("Нельзя снять права администратора с самого себя")

    role = db.query(Role).filter(Role.name == data.role).first()
    if role is None:
        role = Role(name=data.role)
        db.add(role)
        db.flush()

    user.role_id = role.id
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.post("/uploads", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
def upload_admin_file(file: UploadFile = File(), folder: UploadFolder = Form()):
    data, content_type = read_image_upload(file)
    key = upload_image(data, content_type, folder)
    return UploadOut(key=key, url=public_url(key))
