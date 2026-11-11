"""store relative media urls

Revision ID: 15c0522262e7
Revises: a099e40352e8
Create Date: 2026-11-06 12:00:00.000000

"""
import os
from typing import Sequence, Union
from urllib.parse import urlsplit

from alembic import op
import sqlalchemy as sa


revision: str = '15c0522262e7'
down_revision: Union[str, Sequence[str], None] = 'a099e40352e8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


MEDIA_PREFIXES = ("/static/", "/files/")
OWN_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "backend", "hyggy.pp.ua")
URL_COLUMNS = (
    ("Images", "ImageUrl"),
    ("Users", "AvatarUrl"),
    ("BlogPosts", "ImageUrl"),
    ("BlogContentBlockImages", "ImageUrl"),
)


def own_hosts_and_prefixes() -> tuple[set[str], list[str]]:
    hosts = set(OWN_HOSTS)
    prefixes = {"", "/api"}
    try:
        public = urlsplit(os.environ.get("PUBLIC_API_URL", ""))
        public_host = public.hostname
    except ValueError:
        return hosts, sorted(prefixes, key=len, reverse=True)
    if public_host:
        hosts.add(public_host)
    prefixes.add(public.path.rstrip("/"))
    return hosts, sorted(prefixes, key=len, reverse=True)


def relative_url(value: str | None) -> str | None:
    if not value:
        return value
    hosts, prefixes = own_hosts_and_prefixes()
    try:
        parts = urlsplit(value)
        host = parts.hostname
    except ValueError:
        return value
    if parts.scheme not in ("", "http", "https"):
        return value
    if (parts.scheme or parts.netloc) and host not in hosts:
        return value
    for prefix in prefixes:
        rest = parts.path[len(prefix):]
        if parts.path.startswith(prefix) and rest.startswith(MEDIA_PREFIXES):
            return f"{rest}?{parts.query}" if parts.query else rest
    return value


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
