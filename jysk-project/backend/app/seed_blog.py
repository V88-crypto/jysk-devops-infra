from sqlalchemy.orm import Session

from app.config import settings
from app.core.slugs import make_slug
from app.database import SessionLocal
from app.models.blog import BlogCategory, BlogContentBlock, BlogPost
from app.schemas.blog import BlogPostIn
from app.services.blog import base_post_slug, create_post

BLOG_CATEGORIES = ["Догляд", "Стиль", "Поради", "Тренди"]


def rich_blocks(topic: dict, galleries: list[list[str]]) -> list[dict]:
    return [
        {"type": "gallery", "images": galleries[0]},
        {"type": "text", "title": topic["style_title"], "body": topic["style_body"]},
        {"type": "text", "title": topic["comfort_title"], "body": topic["comfort_body"]},
        {"type": "gallery", "images": galleries[1]},
        {"type": "text", "title": topic["design_title"], "body": topic["design_body"]},
        {"type": "gallery", "images": galleries[2]},
    ]


def short_blocks(body: str, image: str) -> list[dict]:
    return [
        {"type": "gallery", "images": [image]},
        {"type": "text", "body": body},
    ]


POSTS = [
    {
        "title": "Секрети довговічності: як доглядати за меблями з натурального дерева",
        "description": "Правильний догляд допомагає меблям з дерева залишатися красивими роками.",
        "image": "dining-chairs.jpg",
        "image_alt": "Дерев’яний стіл у затишному інтер’єрі",
        "category": "Догляд",
        "blocks": rich_blocks(
            {
                "style_title": "Визначте стиль",
                "style_body": "Перш ніж почати шопінг, подумайте про стиль вашого інтер’єру. Чи віддасте ви перевагу класичному, сучасному, мінімалістичному або скандинавському стилю? Вибір стилю допоможе звузити ваш пошук і зробити його більш цілеспрямованим.",
                "comfort_title": "Комфорт — понад усе",
                "comfort_body": "Коли ви обираєте меблі для вашого дому, дуже важливо, щоб вони були зручними і практичними. Комфорт — це насамперед фактор, який впливає на ваш щоденний побут, тому не забувайте випробовувати меблі перед покупкою, якщо є така можливість.",
                "design_title": "Меблевий дизайн не стоїть на місці",
                "design_body": "Сучасні меблі повинні не лише виглядати стильно, а й бути функціональними. Обирайте предмети, які можна використовувати для зберігання речей, з відкидними або висувними елементами. Пам’ятайте, що меблі — це інвестиція у ваш затишок, тому обирайте якісні матеріали, які прослужать довгий час.",
            },
            [
                ["dining.jpg", "cozy-corner.jpg"],
                ["blue-sofa.jpg", "corridor.jpg", "office.jpg"],
                ["living-room.jpg", "kitchen.jpg"],
            ],
        ),
    },
    {
        "title": "10 трендів у дизайні інтер’єру 2024 року, які варто врахувати",
        "description": "Огляд головних тенденцій сезону в оформленні дому.",
        "image": "living-room.jpg",
        "image_alt": "Світла вітальня у скандинавському стилі",
        "category": "Тренди",
        "blocks": short_blocks(
            "Природні матеріали, теплі відтінки та мультифункціональні меблі — головні тренди сезону, які легко вписати у будь-який інтер’єр.",
            "living-room.jpg",
        ),
    },
    {
        "title": "Як обрати ідеальні меблі для маленької квартири",
        "description": "Компактні рішення, які економлять простір без втрати стилю.",
        "image": "storage.jpg",
        "image_alt": "Компактна спальня зі світлими меблями",
        "category": "Поради",
        "blocks": short_blocks(
            "Обирайте трансформери, меблі з прихованим зберіганням та світлі відтінки — вони візуально розширюють простір навіть у невеликій квартирі.",
            "storage.jpg",
        ),
    },
    {
        "title": "Чому варто обрати модульні меблі: переваги та ідеї використання",
        "description": "Гнучкі рішення, які легко адаптувати під будь-який простір.",
        "image": "blue-sofa.jpg",
        "image_alt": "Модульний диван у сучасній вітальні",
        "category": "Стиль",
        "blocks": short_blocks(
            "Модульні меблі дозволяють змінювати конфігурацію під різні задачі — від сімейного перегляду фільмів до прийому гостей.",
            "blue-sofa.jpg",
        ),
    },
    {
        "title": "Нестандартне рішення: як меблі можуть змінити ваш простір",
        "description": "Незвичні прийоми, які освіжать звичний інтер’єр.",
        "image": "kids.jpg",
        "image_alt": "Незвичний акцентний інтер’єр вітальні",
        "category": "Стиль",
        "blocks": short_blocks(
            "Один яскравий акцентний предмет меблів здатен повністю змінити сприйняття кімнати — не бійтеся експериментувати з формою та кольором.",
            "kids.jpg",
        ),
    },
    {
        "title": "Як обрати ідеальні меблі для саду: матеріали, які витримають будь-яку погоду",
        "description": "Розповідаємо, на що звернути увагу під час вибору садових меблів.",
        "image": "garden-wicker-terrace.jpg",
        "image_alt": "Плетені крісла у саду",
        "category": "Поради",
        "blocks": rich_blocks(
            {
                "style_title": "Визначте стиль",
                "style_body": "Ротанг, тік або метал з порошковим покриттям — кожен матеріал має свій характер. Обирайте меблі, які поєднуються зі стилем вашого будинку та ландшафтом ділянки.",
                "comfort_title": "Комфорт — понад усе",
                "comfort_body": "Зверніть увагу на м’які подушки з вологостійких тканин та ергономічну форму крісел і диванів — адже літні вечори на свіжому повітрі мають бути максимально приємними.",
                "design_title": "Меблевий дизайн не стоїть на місці",
                "design_body": "Сучасні виробники пропонують складані та модульні рішення, які легко прибрати на зиму. Це особливо зручно для невеликих терас і балконів.",
            },
            [
                ["garden-table-grass.jpg", "garden-metal-chairs.jpg"],
                ["garden-rattan-dining.jpg", "garden-umbrella.jpg", "garden-wooden-table.jpg"],
                ["garden-potted-plants.jpg", "garden-wicker-terrace.jpg"],
            ],
        ),
    },
    {
        "title": "5 порад для облаштування комфортної тераси",
        "description": "Практичні ідеї для затишного відпочинку на свіжому повітрі.",
        "image": "garden-umbrella.jpg",
        "image_alt": "Затишна тераса з м’якими меблями",
        "category": "Поради",
        "blocks": short_blocks(
            "Додайте текстиль, освітлення та рослини — і навіть невелика тераса стане улюбленим місцем для відпочинку всієї родини.",
            "garden-umbrella.jpg",
        ),
    },
    {
        "title": "Скільки меблів обрати для саду: практичний гайд",
        "description": "Як розрахувати кількість посадкових місць та зон відпочинку.",
        "image": "garden-table-grass.jpg",
        "image_alt": "Садовий стіл з кількома стільцями",
        "category": "Поради",
        "blocks": short_blocks(
            "Плануйте зони заздалегідь: місце для обіду, відпочинку та зберігання інвентарю. Це допоможе уникнути захаращення ділянки зайвими меблями.",
            "garden-table-grass.jpg",
        ),
    },
    {
        "title": "Тренди 2026: садові меблі, які створюють затишок",
        "description": "Огляд найпопулярніших рішень цього сезону.",
        "image": "garden-rattan-dining.jpg",
        "image_alt": "Сучасні садові меблі у затишному дворику",
        "category": "Тренди",
        "blocks": short_blocks(
            "Природні відтінки, плетені текстури та модульні дивани — головні тренди сезону, які легко поєднати з будь-яким ландшафтом.",
            "garden-rattan-dining.jpg",
        ),
    },
    {
        "title": "Нестандартне рішення: як облаштувати сад без зайвих витрат",
        "description": "Прості прийоми, які освіжать двір без капітальних змін.",
        "image": "garden-potted-plants.jpg",
        "image_alt": "Незвичний акцентний куточок у саду",
        "category": "Стиль",
        "blocks": short_blocks(
            "Перефарбовані піддони, підвісні кашпо та гірлянди можуть змінити двір не гірше за дороге озеленення.",
            "garden-potted-plants.jpg",
        ),
    },
    {
        "title": "Чому важливо звертати увагу на жорсткість матраца: все про комфорт і підтримку",
        "description": "Пояснюємо, як правильна жорсткість впливає на якість сну.",
        "image": "sleep.jpg",
        "image_alt": "Затишне ліжко зі світлою білизною",
        "category": "Поради",
        "blocks": rich_blocks(
            {
                "style_title": "Визначте стиль",
                "style_body": "Матраци відрізняються не лише жорсткістю, а й типом наповнювача — пружинний блок, латекс або пінополіуретан. Обирайте варіант відповідно до ваги тіла та звичної пози для сну.",
                "comfort_title": "Комфорт — понад усе",
                "comfort_body": "Занадто м’який або занадто жорсткий матрац однаково шкідливі для хребта. Оптимальна жорсткість підтримує природні вигини тіла та знімає навантаження з проблемних зон.",
                "design_title": "Меблевий дизайн не стоїть на місці",
                "design_body": "Сучасні матраци поєднують кілька шарів з різною жорсткістю, а також охолоджувальні тканини, які підтримують комфортну температуру протягом усієї ночі.",
            },
            [
                ["bedroom-bright.jpg", "bedroom.jpg"],
                ["bedroom-white-linen.jpg", "bedroom-window-nook.jpg", "bedroom-morning.jpg"],
                ["bedroom-attic.jpg", "sleep.jpg"],
            ],
        ),
    },
    {
        "title": "Правильний вибір матраца: гід для покупця",
        "description": "На що звернути увагу перед покупкою нового матраца.",
        "image": "bedroom-bright.jpg",
        "image_alt": "Матрац у світлій спальні",
        "category": "Поради",
        "blocks": short_blocks(
            "Перевіряйте матрац особисто, якщо є можливість, і не забувайте про період адаптації — тілу потрібен час, щоб звикнути до нового матраца.",
            "bedroom-bright.jpg",
        ),
    },
    {
        "title": "Тренди матраців 2026 року",
        "description": "Які рішення для сну стають дедалі популярнішими.",
        "image": "bedroom-white-linen.jpg",
        "image_alt": "Сучасний матрац крупним планом",
        "category": "Тренди",
        "blocks": short_blocks(
            "Гібридні матраци з кількома зонами жорсткості та еко-матеріали — головний тренд цього року серед покупців, які цінують індивідуальний підхід до сну.",
            "bedroom-white-linen.jpg",
        ),
    },
    {
        "title": "Догляд за матрацом: як зберегти якість надовго",
        "description": "Прості звички, які продовжать життя вашому матрацу.",
        "image": "bedroom.jpg",
        "image_alt": "Акуратно застелене ліжко",
        "category": "Догляд",
        "blocks": short_blocks(
            "Провітрюйте матрац, використовуйте наматрацник і перевертайте його раз на кілька місяців — це допоможе зберегти форму та якість надовго.",
            "bedroom.jpg",
        ),
    },
    {
        "title": "Нестандартні рішення для спальні: як покращити якість сну",
        "description": "Незвичні прийоми для кращого відпочинку вночі.",
        "image": "bedroom-attic.jpg",
        "image_alt": "Незвичний акцентний куточок у спальні",
        "category": "Догляд",
        "blocks": short_blocks(
            "Щільні штори, приглушене освітлення та відмова від гаджетів перед сном допомагають організму швидше налаштуватися на відпочинок.",
            "bedroom-attic.jpg",
        ),
    },
]


def static_url(file_name: str) -> str:
    return f"{settings.PUBLIC_API_URL.rstrip('/')}/static/blog/{file_name}"


def get_or_create_blog_category(db: Session, name: str) -> BlogCategory:
    slug = make_slug(name)
    category = db.query(BlogCategory).filter(BlogCategory.slug == slug).first()
    if category is None:
        category = BlogCategory(name=name, slug=slug)
        db.add(category)
        db.flush()
    return category


def seed_blog(db: Session) -> None:
    categories = {name: get_or_create_blog_category(db, name) for name in BLOG_CATEGORIES}

    for item in reversed(POSTS):
        slug = base_post_slug(item["title"])
        if db.query(BlogPost.id).filter(BlogPost.slug == slug).first() is not None:
            continue
        data = BlogPostIn(
            title=item["title"],
            category_id=categories[item["category"]].id,
            description=item["description"],
            image_url=static_url(item["image"]),
            image_alt=item["image_alt"],
            content_blocks=[
                {**block, "images": [static_url(name) for name in block.get("images", [])]}
                for block in item["blocks"]
            ],
        )
        create_post(db, data)


def main() -> None:
    db = SessionLocal()
    try:
        seed_blog(db)
        db.commit()
        print(
            "Blog seed OK:",
            db.query(BlogCategory).count(), "categories,",
            db.query(BlogPost).count(), "posts,",
            db.query(BlogContentBlock).count(), "content blocks",
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
