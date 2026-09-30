from fastapi import HTTPException, UploadFile, status

from app.config import settings


def detect_image_type(data: bytes) -> str | None:
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def read_image_upload(file: UploadFile) -> tuple[bytes, str]:
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    data = file.file.read(max_bytes + 1)
    if len(data) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"Файл больше {settings.MAX_UPLOAD_SIZE_MB} МБ",
        )

    content_type = detect_image_type(data)
    if content_type is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Поддерживаются только изображения JPEG, PNG и WEBP",
        )
    return data, content_type
