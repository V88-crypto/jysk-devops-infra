from fastapi import APIRouter, HTTPException, Response, status

from app.core.storage import StorageObjectNotFoundError, get_object, is_safe_key

router = APIRouter(tags=["files"])

FILE_NOT_FOUND = "Файл не найден"


@router.get(
    "/files/{key:path}",
    response_class=Response,
    responses={200: {"content": {"image/jpeg": {}, "image/png": {}, "image/webp": {}}}},
)
def get_file(key: str):
    if not is_safe_key(key):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=FILE_NOT_FOUND)

    try:
        data, content_type, _ = get_object(key)
    except StorageObjectNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=FILE_NOT_FOUND)

    return Response(
        content=data,
        media_type=content_type,
        headers={
            "Cache-Control": "public, max-age=86400",
            "X-Content-Type-Options": "nosniff",
        },
    )
