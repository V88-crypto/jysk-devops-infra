import re

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogCategoryListOut, BlogPostListOut, BlogPostOut
from app.services.blog import (
    CATEGORY_NOT_FOUND,
    POST_DETAIL_OPTIONS,
    POST_NOT_FOUND,
    category_list_out,
    find_category_by_slug,
    post_to_out,
    posts_page,
)

router = APIRouter(tags=["blog"])

MAX_ID = 2**31 - 1


@router.get("/blog-categories", response_model=BlogCategoryListOut)
def list_blog_categories(db: Session = Depends(get_db)):
    return category_list_out(db)


@router.get("/blog-posts", response_model=BlogPostListOut)
def list_blog_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(BlogPost).filter(BlogPost.is_published.is_(True))
    if category is not None:
        category_obj = find_category_by_slug(db, category)
        if category_obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=CATEGORY_NOT_FOUND)
        query = query.filter(BlogPost.category_id == category_obj.id)
    return posts_page(query, page, page_size)


@router.get("/blog-posts/{id_or_slug}", response_model=BlogPostOut)
def get_blog_post(id_or_slug: str, db: Session = Depends(get_db)):
    query = db.query(BlogPost).filter(BlogPost.is_published.is_(True))
    if re.fullmatch(r"[0-9]+", id_or_slug):
        post_id = int(id_or_slug)
        if post_id > MAX_ID:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=POST_NOT_FOUND)
        query = query.filter(BlogPost.id == post_id)
    else:
        query = query.filter(BlogPost.slug == id_or_slug)

    post = query.options(*POST_DETAIL_OPTIONS).first()
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=POST_NOT_FOUND)
    return post_to_out(post)
