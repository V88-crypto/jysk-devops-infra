import io
import logging
import re
import uuid
from functools import lru_cache

import urllib3
from minio import Minio
from minio.error import MinioException, S3Error

from app.config import settings
from app.core.media import to_public, to_stored

logger = logging.getLogger(__name__)

KNOWN_FOLDERS = ("avatars", "products", "categories", "blog")
KNOWN_PREFIXES = tuple(f"{folder}/" for folder in KNOWN_FOLDERS)
IMAGE_EXTENSIONS = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
KEY_PATTERN = re.compile(r"[A-Za-z0-9_./-]+")

STORAGE_ERRORS = (MinioException, urllib3.exceptions.HTTPError)
MISSING_OBJECT_CODES = ("NoSuchKey", "NoSuchBucket")
EXISTING_BUCKET_CODES = ("BucketAlreadyOwnedByYou", "BucketAlreadyExists")


class StorageUnavailableError(Exception):
    pass


class StorageObjectNotFoundError(Exception):
    pass


@lru_cache
def get_client() -> Minio:
    return Minio(
        settings.MINIO_ENDPOINT,
        access_key=settings.MINIO_ACCESS_KEY,
        secret_key=settings.MINIO_SECRET_KEY,
        secure=settings.MINIO_SECURE,
        http_client=urllib3.PoolManager(
            timeout=urllib3.Timeout(connect=3, read=30),
            retries=urllib3.Retry(
                total=2, backoff_factor=0.2, status_forcelist=[500, 502, 503, 504]
            ),
        ),
    )


def ensure_bucket() -> None:
    bucket = settings.MINIO_BUCKET
    try:
        client = get_client()
        if not client.bucket_exists(bucket_name=bucket):
            client.make_bucket(bucket_name=bucket)
            logger.info("Бакет %s создан в MinIO", bucket)
    except S3Error as error:
        if error.code not in EXISTING_BUCKET_CODES:
            logger.warning("Не удалось проверить бакет %s в MinIO: %s", bucket, error)
    except Exception as error:
        logger.warning(
            "MinIO недоступен (%s), проверка бакета %s пропущена: %s",
            settings.MINIO_ENDPOINT,
            bucket,
            error,
        )


def upload_image(data: bytes, content_type: str, folder: str) -> str:
    key = f"{folder}/{uuid.uuid4().hex}.{IMAGE_EXTENSIONS[content_type]}"
    try:
        get_client().put_object(
            bucket_name=settings.MINIO_BUCKET,
            object_name=key,
            data=io.BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
    except STORAGE_ERRORS as error:
        logger.error("Не удалось загрузить %s в MinIO: %s", key, error)
        raise StorageUnavailableError from error
    return key


def get_object(key: str) -> tuple[bytes, str, int]:
    response = None
    try:
        response = get_client().get_object(bucket_name=settings.MINIO_BUCKET, object_name=key)
        data = response.read()
        content_type = response.headers.get("Content-Type", "application/octet-stream")
    except S3Error as error:
        if error.code in MISSING_OBJECT_CODES:
            raise StorageObjectNotFoundError(key) from error
        logger.error("Ошибка MinIO при чтении %s: %s", key, error)
        raise StorageUnavailableError from error
    except STORAGE_ERRORS as error:
        logger.error("Не удалось прочитать %s из MinIO: %s", key, error)
        raise StorageUnavailableError from error
    finally:
        if response is not None:
            response.close()
            response.release_conn()
    return data, content_type, len(data)


def delete_object(key: str) -> None:
    try:
        get_client().remove_object(bucket_name=settings.MINIO_BUCKET, object_name=key)
    except S3Error as error:
        if error.code in MISSING_OBJECT_CODES:
            return
        logger.error("Ошибка MinIO при удалении %s: %s", key, error)
        raise StorageUnavailableError from error
    except STORAGE_ERRORS as error:
        logger.error("Не удалось удалить %s из MinIO: %s", key, error)
        raise StorageUnavailableError from error


FILES_PREFIX = "/files/"


def stored_url(key: str) -> str:
    return f"{FILES_PREFIX}{key}"


def public_url(key: str) -> str:
    return to_public(stored_url(key))


def is_safe_key(key: str) -> bool:
    return (
        KEY_PATTERN.fullmatch(key) is not None
        and ".." not in key
        and not key.startswith("/")
        and key.startswith(KNOWN_PREFIXES)
    )


def key_from_url(url: str | None) -> str | None:
    stored = to_stored(url)
    if not stored or not stored.startswith(FILES_PREFIX):
        return None
    key = stored[len(FILES_PREFIX):]
    return key if is_safe_key(key) else None
