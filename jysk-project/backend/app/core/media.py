from typing import Annotated
from urllib.parse import urlsplit

from pydantic import AfterValidator

from app.config import settings

MEDIA_PREFIXES = ("/static/", "/files/")
WEB_SCHEMES = ("", "http", "https")


def media_path(url: str) -> str | None:
    parts = urlsplit(url)
    if parts.scheme not in WEB_SCHEMES:
        return None
    path = parts.path
    if not parts.scheme and not parts.netloc and not path.startswith("/"):
        path = f"/{path}"
    positions = [path.find(prefix) for prefix in MEDIA_PREFIXES if prefix in path]
    if not positions:
        return None
    result = path[min(positions):]
    if parts.query:
        result = f"{result}?{parts.query}"
    return result


def to_stored(url: str | None) -> str | None:
    if not url:
        return url
    path = media_path(url)
    return url if path is None else path


def to_public(url: str | None) -> str | None:
    stored = to_stored(url)
    if stored and stored.startswith(MEDIA_PREFIXES):
        return f"{settings.PUBLIC_API_URL.rstrip('/')}{stored}"
    return stored


PublicUrl = Annotated[str, AfterValidator(to_public)]
OptionalPublicUrl = Annotated[str | None, AfterValidator(to_public)]
