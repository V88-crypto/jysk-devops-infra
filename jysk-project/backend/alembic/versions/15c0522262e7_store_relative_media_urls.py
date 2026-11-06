"""store relative media urls

Revision ID: 15c0522262e7
Revises: a099e40352e8
Create Date: 2026-11-06 12:00:00.000000

"""
from typing import Sequence, Union
from urllib.parse import urlsplit

from alembic import op
import sqlalchemy as sa


revision: str = '15c0522262e7'
down_revision: Union[str, Sequence[str], None] = 'a099e40352e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


MEDIA_PREFIXES = ("/static/", "/files/")
URL_COLUMNS = (
    ("Images", "ImageUrl"),
    ("Users", "AvatarUrl"),
    ("BlogPosts", "ImageUrl"),
    ("BlogContentBlockImages", "ImageUrl"),
)


def relative_url(value: str) -> str:
    parts = urlsplit(value)
    if parts.scheme not in ("http", "https") and not parts.netloc:
        return value
    positions = [parts.path.find(prefix) for prefix in MEDIA_PREFIXES if prefix in parts.path]
    if not positions:
        return value
    result = parts.path[min(positions):]
    if parts.query:
        result = f"{result}?{parts.query}"
    return result


def upgrade() -> None:
    bind = op.get_bind()
    for table_name, column_name in URL_COLUMNS:
        table = sa.table(table_name, sa.column("Id", sa.Integer), sa.column(column_name, sa.String))
        url_column = table.c[column_name]
        rows = bind.execute(sa.select(table.c.Id, url_column).where(url_column.isnot(None))).all()
        for row_id, url in rows:
            stored = relative_url(url)
            if stored != url:
                bind.execute(
                    table.update().where(table.c.Id == row_id).values({column_name: stored})
                )


def downgrade() -> None:
    pass
