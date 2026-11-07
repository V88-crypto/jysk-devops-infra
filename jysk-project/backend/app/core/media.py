from typing import Annotated
from urllib.parse import urlsplit

from pydantic import AfterValidator

from app.config import settings

MEDIA_PREFIXES = ("/static/", "/files/")
API_PREFIX = "/api"
WEB_SCHEMES = ("", "http", "https")
DEFAULT_TRUSTED_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "backend", "hyggy.pp.ua")


def public_api_parts():
    try:
        parts = urlsplit(settings.PUBLIC_API_URL)
        return parts.hostname, parts.path.rstrip("/")
    except ValueError:
        return None, ""


def trusted_hosts() -> set[str]:
    hosts = set(DEFAULT_TRUSTED_HOSTS)
    public_host, _ = public_api_parts()
    if public_host:
        hosts.add(public_host)
    hosts.update(
        host.strip().lower() for host in settings.MEDIA_TRUSTED_HOSTS.split(",") if host.strip()
    )
    return hosts


def path_prefixes() -> set[str]:
    _, public_path = public_api_parts()
    return {"", API_PREFIX, public_path}


def own_media_path(url: str | None) -> str | None:
    if not url:
        return None
    try:
        parts = urlsplit(url)
        host = parts.hostname
    except ValueError:
        return None
    if parts.scheme not in WEB_SCHEMES:
        return None
    if parts.scheme or parts.netloc:
        if host is None or host not in trusted_hosts():
            return None
    for prefix in sorted(path_prefixes(), key=len, reverse=True):
        rest = parts.path[len(prefix):]
        if parts.path.startswith(prefix) and rest.startswith(MEDIA_PREFIXES):
            return f"{rest}?{parts.query}" if parts.query else rest
    return None


def to_stored(url: str | None) -> str | None:
    path = own_media_path(url)
    return url if path is None else path


def to_public(url: str | None) -> str | None:
    stored = to_stored(url)
    if stored and stored.startswith(MEDIA_PREFIXES):
        return f"{settings.PUBLIC_API_URL.rstrip('/')}{stored}"
    return stored


PublicUrl = Annotated[str, AfterValidator(to_public)]
OptionalPublicUrl = Annotated[str | None, AfterValidator(to_public)]
