import importlib.util
from pathlib import Path

import pytest

from app.config import settings
from app.core.media import to_public, to_stored
from app.core.storage import key_from_url

MIGRATION_PATH = (
    Path(__file__).resolve().parent.parent
    / "alembic"
    / "versions"
    / "15c0522262e7_store_relative_media_urls.py"
)
PROD_API = "https://hyggy.pp.ua/api"
CUSTOM_API = "https://shop.example.org/api"

OWN_URLS = [
    ("/static/blog/a.jpg", "/static/blog/a.jpg"),
    ("/files/products/a.png", "/files/products/a.png"),
    ("/api/static/blog/a.jpg", "/static/blog/a.jpg"),
    ("/api/files/avatars/1/a.png", "/files/avatars/1/a.png"),
    ("http://localhost:8000/static/blog/dining-chairs.jpg", "/static/blog/dining-chairs.jpg"),
    ("http://LOCALHOST:8000/files/products/a.png", "/files/products/a.png"),
    ("http://127.0.0.1:8000/files/products/a.png", "/files/products/a.png"),
    ("http://0.0.0.0:8000/static/blog/a.jpg", "/static/blog/a.jpg"),
    ("http://backend:8000/files/blog/a.jpg", "/files/blog/a.jpg"),
    ("http://hyggy.pp.ua/api/static/blog/a.jpg", "/static/blog/a.jpg"),
    ("https://hyggy.pp.ua/api/files/products/a.png", "/files/products/a.png"),
    ("https://Hyggy.PP.ua/static/blog/a.jpg", "/static/blog/a.jpg"),
    ("https://hyggy.pp.ua/api/files/products/a.png?v=2", "/files/products/a.png?v=2"),
    ("/static/blog/a.jpg?v=2", "/static/blog/a.jpg?v=2"),
]

EXTERNAL_URLS = [
    "https://example.com/static/external.jpg",
    "https://cdn.example.com/files/a.jpg",
    "https://picsum.photos/seed/x/600/400",
    "http://localhost.evil.com/static/x.jpg",
    "http://evilhyggy.pp.ua/static/x.jpg",
    "https://example.com/api/files/avatars/1/a.png",
    "//cdn.example.com/static/x.jpg",
    "ftp://localhost/static/x.jpg",
    "data:image/png;base64,AAAA/static/x",
    "static/blog/a.jpg",
    "/images/a.jpg",
    "/other/static/a.jpg",
]


@pytest.fixture(autouse=True)
def media_settings(monkeypatch):
    monkeypatch.setattr(settings, "PUBLIC_API_URL", "http://localhost:8000")
    monkeypatch.setattr(settings, "MEDIA_TRUSTED_HOSTS", "")


@pytest.fixture
def migration(monkeypatch):
    monkeypatch.delenv("PUBLIC_API_URL", raising=False)
    spec = importlib.util.spec_from_file_location("media_migration", MIGRATION_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.mark.parametrize(("url", "expected"), OWN_URLS)
def test_to_stored_own_urls(url, expected):
    assert to_stored(url) == expected


@pytest.mark.parametrize("url", EXTERNAL_URLS)
def test_to_stored_keeps_external_urls(url):
    assert to_stored(url) == url


@pytest.mark.parametrize("url", [None, ""])
def test_to_stored_empty(url):
    assert to_stored(url) == url


def test_to_stored_public_api_host(monkeypatch):
    url = "https://shop.example.org/api/static/blog/a.jpg"
    assert to_stored(url) == url
    monkeypatch.setattr(settings, "PUBLIC_API_URL", CUSTOM_API)
    assert to_stored(url) == "/static/blog/a.jpg"
    assert to_stored("http://shop.example.org:8080/files/blog/a.jpg") == "/files/blog/a.jpg"


def test_to_stored_public_api_path_prefix(monkeypatch):
    monkeypatch.setattr(settings, "PUBLIC_API_URL", "https://hyggy.pp.ua/backend")
    assert to_stored("https://hyggy.pp.ua/backend/static/blog/a.jpg") == "/static/blog/a.jpg"
    assert to_stored("/backend/files/blog/a.jpg") == "/files/blog/a.jpg"


def test_to_stored_trusted_hosts_setting(monkeypatch):
    url = "https://media.example.net/files/products/a.png"
    assert to_stored(url) == url
    monkeypatch.setattr(settings, "MEDIA_TRUSTED_HOSTS", " Media.Example.net , other.host ,")
    assert to_stored(url) == "/files/products/a.png"
    assert to_stored("http://other.host/static/a.jpg") == "/static/a.jpg"
    assert to_stored("https://example.com/static/external.jpg") == "https://example.com/static/external.jpg"


@pytest.mark.parametrize("public_api", [PROD_API, "/api", "http://localhost:8000"])
@pytest.mark.parametrize(("url", "expected"), OWN_URLS)
def test_to_public_own_urls(monkeypatch, public_api, url, expected):
    monkeypatch.setattr(settings, "PUBLIC_API_URL", public_api)
    public = to_public(url)
    assert public == public_api + expected
    assert to_public(public) == public
    assert to_public(to_public(public)) == public


@pytest.mark.parametrize("public_api", [PROD_API, "/api"])
@pytest.mark.parametrize("url", EXTERNAL_URLS)
def test_to_public_keeps_external_urls(monkeypatch, public_api, url):
    monkeypatch.setattr(settings, "PUBLIC_API_URL", public_api)
    assert to_public(url) == url


def test_to_public_empty():
    assert to_public(None) is None
    assert to_public("") == ""


def test_to_public_with_trailing_slash(monkeypatch):
    monkeypatch.setattr(settings, "PUBLIC_API_URL", PROD_API + "/")
    assert to_public("/static/blog/a.jpg") == PROD_API + "/static/blog/a.jpg"


@pytest.mark.parametrize(
    ("url", "key"),
    [
        ("/files/avatars/1/a.png", "avatars/1/a.png"),
        ("/api/files/avatars/1/a.png", "avatars/1/a.png"),
        ("http://localhost:8000/files/avatars/1/a.png", "avatars/1/a.png"),
        ("https://hyggy.pp.ua/api/files/blog/b.jpg", "blog/b.jpg"),
    ],
)
def test_key_from_url_own(url, key):
    assert key_from_url(url) == key


@pytest.mark.parametrize(
    "url",
    [
        "https://example.com/files/avatars/1/a.png",
        "https://cdn.example.com/files/a.jpg",
        "http://localhost.evil.com/files/avatars/1/a.png",
        "https://picsum.photos/seed/x/600/400",
        "/static/blog/a.jpg",
        "/files/../etc/passwd",
        "/files/unknown/a.png",
        None,
        "",
    ],
)
def test_key_from_url_rejects(url):
    assert key_from_url(url) is None


@pytest.mark.parametrize(("url", "expected"), OWN_URLS)
def test_migration_own_urls(migration, url, expected):
    assert migration.relative_url(url) == expected


@pytest.mark.parametrize("url", EXTERNAL_URLS)
def test_migration_keeps_external_urls(migration, url):
    assert migration.relative_url(url) == url


@pytest.mark.parametrize("url", [None, ""])
def test_migration_empty(migration, url):
    assert migration.relative_url(url) == url


def test_migration_public_api_url_env(migration, monkeypatch):
    url = "https://shop.example.org/api/files/blog/a.jpg"
    assert migration.relative_url(url) == url
    monkeypatch.setenv("PUBLIC_API_URL", CUSTOM_API)
    assert migration.relative_url(url) == "/files/blog/a.jpg"
    assert migration.relative_url("https://example.com/static/external.jpg") == (
        "https://example.com/static/external.jpg"
    )


def test_migration_does_not_use_app_code():
    source = MIGRATION_PATH.read_text(encoding="utf-8")
    assert "from app" not in source and "import app" not in source
