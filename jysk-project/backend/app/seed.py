from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.catalog import (
    Attribute,
    Category,
    Image,
    Product,
    ProductVariant,
    VariantAttribute,
)
from app.models.user import Role, User

ADMIN_ROLE = "admin"
ADMIN_EMAIL = "admin@jysk.local"
ADMIN_PASSWORD = "Admin12345"

CATEGORY_TREE = [
    ("Мебель", "mebel", [("Диваны", "divany"), ("Кресла", "kresla"), ("Столы", "stoly")]),
    ("Спальня", "spalnya", [("Матрасы", "matrasy"), ("Подушки", "podushki"), ("Одеяла", "odeyala")]),
    ("Ванная", "vannaya", [("Полотенца", "polotentsa"), ("Коврики для ванной", "kovriki-dlya-vannoy"), ("Шторы для душа", "shtory-dlya-dusha")]),
]

PRODUCTS = [
    {
        "name": "Диван FALSLEV",
        "slug": "divan-falslev",
        "category": "divany",
        "description": "Трёхместный диван с тканевой обивкой и широкими подлокотниками. Прочный каркас из массива дерева.",
        "variants": [
            {"sku": "FALSLEV-GREY", "price": "2499.00", "stock": 12, "attrs": {"Цвет": "серый"}},
            {"sku": "FALSLEV-BLUE", "price": "2599.00", "stock": 5, "attrs": {"Цвет": "синий"}},
        ],
    },
    {
        "name": "Диван-кровать VEJLBY",
        "slug": "divan-krovat-vejlby",
        "category": "divany",
        "description": "Раскладной диван-кровать с ящиком для белья. Идеален для небольших квартир.",
        "variants": [
            {"sku": "VEJLBY-DGREY-160", "price": "2899.00", "stock": 7, "attrs": {"Цвет": "тёмно-серый", "Размер": "160x200"}},
            {"sku": "VEJLBY-BEIGE-140", "price": "2699.00", "stock": 0, "attrs": {"Цвет": "бежевый", "Размер": "140x200"}},
        ],
    },
    {
        "name": "Кресло GISTRUP",
        "slug": "kreslo-gistrup",
        "category": "kresla",
        "description": "Мягкое кресло на деревянных ножках со съёмной подушкой сиденья.",
        "variants": [
            {"sku": "GISTRUP-GREEN", "price": "899.00", "stock": 20, "attrs": {"Цвет": "зелёный"}},
            {"sku": "GISTRUP-GREY", "price": "899.00", "stock": 14, "attrs": {"Цвет": "серый"}},
            {"sku": "GISTRUP-YELLOW", "price": "949.00", "stock": 3, "attrs": {"Цвет": "горчичный"}},
        ],
    },
    {
        "name": "Кресло-качалка ULFBORG",
        "slug": "kreslo-kachalka-ulfborg",
        "category": "kresla",
        "description": "Кресло-качалка из гнутого дерева с мягкой подушкой в комплекте.",
        "variants": [
            {"sku": "ULFBORG-NAT", "price": "1199.00", "stock": 8, "attrs": {"Цвет": "натуральный"}},
        ],
    },
    {
        "name": "Журнальный столик SKALS",
        "slug": "zhurnalnyy-stolik-skals",
        "category": "stoly",
        "description": "Журнальный столик из дуба с нижней полкой для журналов.",
        "variants": [
            {"sku": "SKALS-OAK-60", "price": "549.00", "stock": 25, "attrs": {"Цвет": "дуб", "Размер": "60x60"}},
            {"sku": "SKALS-OAK-90", "price": "749.00", "stock": 10, "attrs": {"Цвет": "дуб", "Размер": "90x60"}},
        ],
    },
    {
        "name": "Обеденный стол HALDUM",
        "slug": "obedennyy-stol-haldum",
        "category": "stoly",
        "description": "Раздвижной обеденный стол на 6 персон с ламинированной столешницей.",
        "variants": [
            {"sku": "HALDUM-WHITE-160", "price": "1599.00", "stock": 6, "attrs": {"Цвет": "белый", "Размер": "160x90"}},
        ],
    },
    {
        "name": "Матрас GOLD S30",
        "slug": "matras-gold-s30",
        "category": "matrasy",
        "description": "Пружинный матрас средней жёсткости с чехлом из трикотажа, высота 26 см.",
        "variants": [
            {"sku": "GOLD-S30-90", "price": "1299.00", "stock": 15, "attrs": {"Размер": "90x200"}},
            {"sku": "GOLD-S30-140", "price": "1899.00", "stock": 9, "attrs": {"Размер": "140x200"}},
            {"sku": "GOLD-S30-160", "price": "2099.00", "stock": 4, "attrs": {"Размер": "160x200"}},
        ],
    },
    {
        "name": "Матрас BASIC S5",
        "slug": "matras-basic-s5",
        "category": "matrasy",
        "description": "Беспружинный матрас из пены, высота 12 см. Хорош для гостевой кровати.",
        "variants": [
            {"sku": "BASIC-S5-90", "price": "449.00", "stock": 30, "attrs": {"Размер": "90x200"}},
            {"sku": "BASIC-S5-140", "price": "649.00", "stock": 18, "attrs": {"Размер": "140x200"}},
        ],
    },
    {
        "name": "Подушка ULVIG",
        "slug": "podushka-ulvig",
        "category": "podushki",
        "description": "Подушка с наполнителем из микрофибры, чехол из 100% хлопка.",
        "variants": [
            {"sku": "ULVIG-5070", "price": "89.00", "stock": 50, "attrs": {"Размер": "50x70"}},
            {"sku": "ULVIG-7070", "price": "109.00", "stock": 35, "attrs": {"Размер": "70x70"}},
        ],
    },
    {
        "name": "Подушка анатомическая WELLPUR",
        "slug": "podushka-wellpur",
        "category": "podushki",
        "description": "Анатомическая подушка из пены с эффектом памяти для комфортного сна.",
        "variants": [
            {"sku": "WELLPUR-5030", "price": "199.00", "stock": 22, "attrs": {"Размер": "50x30"}},
        ],
    },
    {
        "name": "Одеяло KRONBORG CLASSIC",
        "slug": "odeyalo-kronborg-classic",
        "category": "odeyala",
        "description": "Тёплое одеяло с наполнителем из полиэстера, можно стирать при 60°C.",
        "variants": [
            {"sku": "KRONBORG-CL-140", "price": "249.00", "stock": 28, "attrs": {"Размер": "140x200"}},
            {"sku": "KRONBORG-CL-200", "price": "399.00", "stock": 11, "attrs": {"Размер": "200x220"}},
        ],
    },
    {
        "name": "Полотенце UPPSALA",
        "slug": "polotence-uppsala",
        "category": "polotentsa",
        "description": "Махровое полотенце из 100% хлопка, плотность 400 г/м².",
        "variants": [
            {"sku": "UPPSALA-WHITE-50100", "price": "55.00", "stock": 40, "attrs": {"Цвет": "белый", "Размер": "50x100"}},
            {"sku": "UPPSALA-GREY-70140", "price": "95.00", "stock": 26, "attrs": {"Цвет": "серый", "Размер": "70x140"}},
            {"sku": "UPPSALA-BLUE-70140", "price": "95.00", "stock": 0, "attrs": {"Цвет": "голубой", "Размер": "70x140"}},
        ],
    },
    {
        "name": "Полотенце KARLSTAD",
        "slug": "polotence-karlstad",
        "category": "polotentsa",
        "description": "Плотное банное полотенце премиум-класса, 500 г/м².",
        "variants": [
            {"sku": "KARLSTAD-SAND-70140", "price": "119.00", "stock": 17, "attrs": {"Цвет": "песочный", "Размер": "70x140"}},
        ],
    },
    {
        "name": "Коврик для ванной KARUP",
        "slug": "kovrik-dlya-vannoy-karup",
        "category": "kovriki-dlya-vannoy",
        "description": "Мягкий коврик для ванной с антискользящей основой.",
        "variants": [
            {"sku": "KARUP-GREY", "price": "79.00", "stock": 33, "attrs": {"Цвет": "серый", "Размер": "50x80"}},
            {"sku": "KARUP-GREEN", "price": "79.00", "stock": 21, "attrs": {"Цвет": "зелёный", "Размер": "50x80"}},
        ],
    },
    {
        "name": "Штора для душа GRENAA",
        "slug": "shtora-dlya-dusha-grenaa",
        "category": "shtory-dlya-dusha",
        "description": "Водоотталкивающая штора для душа, кольца в комплекте.",
        "variants": [
            {"sku": "GRENAA-WHITE", "price": "69.00", "stock": 45, "attrs": {"Цвет": "белый", "Размер": "180x200"}},
            {"sku": "GRENAA-STRIPE", "price": "75.00", "stock": 19, "attrs": {"Цвет": "в полоску", "Размер": "180x200"}},
        ],
    },
]


def get_or_create_category(db: Session, name: str, slug: str, parent_id: int | None) -> Category:
    category = db.query(Category).filter(Category.slug == slug).first()
    if category is None:
        category = Category(name=name, slug=slug, parent_id=parent_id)
        db.add(category)
        db.flush()
    return category


def seed_admin(db: Session) -> None:
    role = db.query(Role).filter(Role.name == ADMIN_ROLE).first()
    if role is None:
        role = Role(name=ADMIN_ROLE)
        db.add(role)
        db.flush()
    if db.query(User).filter(User.email == ADMIN_EMAIL).first() is None:
        db.add(
            User(
                first_name="Admin",
                last_name="Jysk",
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                role_id=role.id,
            )
        )


def get_or_create_attribute(db: Session, name: str) -> Attribute:
    attribute = db.query(Attribute).filter(Attribute.name == name).first()
    if attribute is None:
        attribute = Attribute(name=name)
        db.add(attribute)
        db.flush()
    return attribute


def create_variant(db: Session, product: Product, data: dict, image_count: int) -> None:
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
    for n in range(image_count):
        db.add(
            Image(
                variant_id=variant.id,
                image_url=f"https://picsum.photos/seed/{variant.sku}-{n + 1}/800/600",
                is_primary=(n == 0),
                sort_order=n,
            )
        )


def seed(db: Session) -> None:
    seed_admin(db)

    categories = {}
    for name, slug, children in CATEGORY_TREE:
        root = get_or_create_category(db, name, slug, None)
        for child_name, child_slug in children:
            categories[child_slug] = get_or_create_category(db, child_name, child_slug, root.id)

    for item in PRODUCTS:
        product = db.query(Product).filter(Product.slug == item["slug"]).first()
        if product is None:
            product = Product(
                category_id=categories[item["category"]].id,
                name=item["name"],
                slug=item["slug"],
                description=item["description"],
            )
            db.add(product)
            db.flush()
        for index, variant_data in enumerate(item["variants"]):
            exists = (
                db.query(ProductVariant)
                .filter(ProductVariant.sku == variant_data["sku"])
                .first()
            )
            if exists is None:
                create_variant(db, product, variant_data, image_count=3 if index == 0 else 2)


def main() -> None:
    db = SessionLocal()
    try:
        seed(db)
        db.commit()
        print(
            "Seed OK:",
            db.query(Category).count(), "categories,",
            db.query(Product).count(), "products,",
            db.query(ProductVariant).count(), "variants,",
            db.query(User).count(), "users",
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
