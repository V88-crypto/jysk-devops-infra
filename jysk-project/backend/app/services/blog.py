from sqlalchemy import func
from sqlalchemy.orm import Query, Session, selectinload

from app.core.media import to_stored
from app.core.slugs import make_slug
from app.models.blog import BlogCategory, BlogContentBlock, BlogContentBlockImage, BlogPost
from app.schemas.blog import (
    BlogCategoryListOut,
    BlogCategoryOut,
    BlogContentBlockIn,
    BlogContentBlockOut,
    BlogPostIn,
    BlogPostListOut,
    BlogPostOut,
    BlogPostSummaryOut,
)

CATEGORY_NOT_FOUND = "Категорію блогу не знайдено"
POST_NOT_FOUND = "Статтю не знайдено"

DESCRIPTION_LENGTH = 200
SLUG_BASE_LENGTH = 270
TRAILING_PUNCTUATION = " ,.;:!?—–-"

POST_LIST_OPTIONS = (selectinload(BlogPost.category),)
POST_DETAIL_OPTIONS = (
    selectinload(BlogPost.category),
    selectinload(BlogPost.blocks).selectinload(BlogContentBlock.images),
)


def make_description(blocks: list[BlogContentBlockIn]) -> str | None:
    body = next((block.body for block in blocks if block.type == "text" and block.body), None)
    if body is None:
        return None
    text = " ".join(body.split())
    if len(text) <= DESCRIPTION_LENGTH:
        return text
    cut = text[: DESCRIPTION_LENGTH + 1]
    cut = cut[: cut.rfind(" ")] if " " in cut else text[:DESCRIPTION_LENGTH]
    return cut.rstrip(TRAILING_PUNCTUATION) + "…"


def base_post_slug(title: str) -> str:
    slug = make_slug(title)[:SLUG_BASE_LENGTH].strip("-") or "post"
    if slug.isdigit():
        slug = f"post-{slug}"
    return slug


def unique_post_slug(db: Session, title: str) -> str:
    base = base_post_slug(title)
    slug = base
    suffix = 2
    while db.query(BlogPost.id).filter(BlogPost.slug == slug).first() is not None:
        slug = f"{base}-{suffix}"
        suffix += 1
    return slug


def build_blocks(blocks: list[BlogContentBlockIn]) -> list[BlogContentBlock]:
    return [
        BlogContentBlock(
            type=block.type,
            title=block.title,
            body=block.body,
            sort_order=index,
            images=[
                BlogContentBlockImage(image_url=to_stored(url), sort_order=position)
                for position, url in enumerate(block.images)
            ],
        )
        for index, block in enumerate(blocks)
    ]


def fill_post(post: BlogPost, data: BlogPostIn) -> None:
    post.title = data.title
    post.category_id = data.category_id
    post.description = data.description or make_description(data.content_blocks)
    post.image_url = to_stored(data.image_url)
    post.image_alt = data.image_alt
    post.keywords = data.keywords or None
    post.is_published = data.is_published
    post.blocks = build_blocks(data.content_blocks)


def create_post(db: Session, data: BlogPostIn) -> BlogPost:
    post = BlogPost(slug=unique_post_slug(db, data.title))
    fill_post(post, data)
    db.add(post)
    db.flush()
    return post


def update_post(post: BlogPost, data: BlogPostIn) -> None:
    fill_post(post, data)
    post.updated_at = func.now()


def load_post(db: Session, post_id: int) -> BlogPost | None:
    return (
        db.query(BlogPost)
        .filter(BlogPost.id == post_id)
        .options(*POST_DETAIL_OPTIONS)
        .first()
    )


def find_category_by_slug(db: Session, slug: str) -> BlogCategory | None:
    return db.query(BlogCategory).filter(BlogCategory.slug == slug).first()


def category_list_out(db: Session) -> BlogCategoryListOut:
    categories = db.query(BlogCategory).order_by(BlogCategory.id).all()
    items = [BlogCategoryOut.model_validate(category) for category in categories]
    return BlogCategoryListOut(items=items, total=len(items), page=1, page_size=len(items))


def summary_fields(post: BlogPost) -> dict:
    return {
        "id": post.id,
        "slug": post.slug,
        "title": post.title,
        "description": post.description,
        "image_url": post.image_url,
        "image_alt": post.image_alt,
        "category": BlogCategoryOut.model_validate(post.category),
        "keywords": post.keywords or [],
        "is_published": post.is_published,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def post_to_summary(post: BlogPost) -> BlogPostSummaryOut:
    return BlogPostSummaryOut(**summary_fields(post))


def post_to_out(post: BlogPost) -> BlogPostOut:
    blocks = [
        BlogContentBlockOut(
            id=block.id,
            type=block.type,
            title=block.title,
            body=block.body,
            sort_order=block.sort_order,
            images=[image.image_url for image in block.images],
        )
        for block in post.blocks
    ]
    return BlogPostOut(**summary_fields(post), content_blocks=blocks)


def posts_page(query: Query, page: int, page_size: int) -> BlogPostListOut:
    total = query.count()
    posts = (
        query.options(*POST_LIST_OPTIONS)
        .order_by(BlogPost.created_at.desc(), BlogPost.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return BlogPostListOut(
        items=[post_to_summary(post) for post in posts],
        total=total,
        page=page,
        page_size=page_size,
    )
