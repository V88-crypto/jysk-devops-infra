from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator, model_validator
from pydantic_core import PydanticCustomError

from app.core.media import PublicUrl

BlockType = Literal["text", "gallery"]

TITLE_LIMIT = 255
CATEGORY_NAME_LIMIT = 100
DESCRIPTION_LIMIT = 500
IMAGE_ALT_LIMIT = 255
IMAGE_URL_LIMIT = 512
KEYWORDS_LIMIT = 20
KEYWORD_LENGTH_LIMIT = 50


def clean_text(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip() or None


def check_length(value: str | None, limit: int, error_type: str, message: str) -> str | None:
    if value is not None and len(value) > limit:
        raise PydanticCustomError(error_type, message)
    return value


def check_image_url(value: str) -> str:
    value = value.strip()
    if not value:
        raise PydanticCustomError(
            "image_url_required", "Потрібно вказати посилання на зображення"
        )
    return check_length(
        value,
        IMAGE_URL_LIMIT,
        "image_url_too_long",
        "Посилання на зображення не може бути довшим за 512 символів",
    )


class BlogCategoryIn(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def check_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise PydanticCustomError(
                "name_required", "Назва категорії не може бути порожньою"
            )
        return check_length(
            value,
            CATEGORY_NAME_LIMIT,
            "name_too_long",
            "Назва категорії не може бути довшою за 100 символів",
        )


class BlogContentBlockIn(BaseModel):
    type: BlockType
    title: str | None = None
    body: str | None = None
    images: list[str] = []

    @field_validator("title")
    @classmethod
    def check_title(cls, value: str | None) -> str | None:
        return check_length(
            clean_text(value),
            TITLE_LIMIT,
            "block_title_too_long",
            "Заголовок блоку не може бути довшим за 255 символів",
        )

    @field_validator("body")
    @classmethod
    def check_body(cls, value: str | None) -> str | None:
        return clean_text(value)

    @field_validator("images")
    @classmethod
    def check_images(cls, value: list[str]) -> list[str]:
        return [check_image_url(url) for url in value]

    @model_validator(mode="after")
    def check_content(self):
        if self.type == "text" and self.body is None:
            raise PydanticCustomError("text_body_required", "Текстовий блок має містити текст")
        if self.type == "gallery" and not self.images:
            raise PydanticCustomError(
                "gallery_images_required", "Галерея має містити хоча б одне зображення"
            )
        return self


class BlogPostIn(BaseModel):
    title: str
    category_id: int
    description: str | None = None
    image_url: str
    image_alt: str | None = None
    keywords: list[str] | None = None
    is_published: bool = True
    content_blocks: list[BlogContentBlockIn]

    @field_validator("title")
    @classmethod
    def check_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise PydanticCustomError("title_required", "Заголовок не може бути порожнім")
        return check_length(
            value,
            TITLE_LIMIT,
            "title_too_long",
            "Заголовок не може бути довшим за 255 символів",
        )

    @field_validator("description")
    @classmethod
    def check_description(cls, value: str | None) -> str | None:
        return check_length(
            clean_text(value),
            DESCRIPTION_LIMIT,
            "description_too_long",
            "Опис не може бути довшим за 500 символів",
        )

    @field_validator("image_url")
    @classmethod
    def check_cover(cls, value: str) -> str:
        return check_image_url(value)

    @field_validator("image_alt")
    @classmethod
    def check_image_alt(cls, value: str | None) -> str | None:
        return check_length(
            clean_text(value),
            IMAGE_ALT_LIMIT,
            "image_alt_too_long",
            "Підпис до обкладинки не може бути довшим за 255 символів",
        )

    @field_validator("keywords")
    @classmethod
    def clean_keywords(cls, value: list[str] | None) -> list[str]:
        result = []
        seen = set()
        for keyword in value or []:
            keyword = keyword.strip()
            if not keyword or keyword.casefold() in seen:
                continue
            check_length(
                keyword,
                KEYWORD_LENGTH_LIMIT,
                "keyword_too_long",
                "Ключове слово не може бути довшим за 50 символів",
            )
            seen.add(keyword.casefold())
            result.append(keyword)
        if len(result) > KEYWORDS_LIMIT:
            raise PydanticCustomError(
                "too_many_keywords", "Можна вказати не більше 20 ключових слів"
            )
        return result


class BlogCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str


class BlogCategoryListOut(BaseModel):
    items: list[BlogCategoryOut]
    total: int
    page: int
    page_size: int


class BlogContentBlockOut(BaseModel):
    id: int
    type: str
    title: str | None
    body: str | None
    sort_order: int
    images: list[PublicUrl]


class BlogPostSummaryOut(BaseModel):
    id: int
    slug: str
    title: str
    description: str | None
    image_url: PublicUrl
    image_alt: str | None
    category: BlogCategoryOut
    keywords: list[str]
    is_published: bool
    created_at: datetime
    updated_at: datetime


class BlogPostOut(BlogPostSummaryOut):
    content_blocks: list[BlogContentBlockOut]


class BlogPostListOut(BaseModel):
    items: list[BlogPostSummaryOut]
    total: int
    page: int
    page_size: int
