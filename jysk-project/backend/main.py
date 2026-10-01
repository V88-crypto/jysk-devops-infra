import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.storage import StorageUnavailableError, ensure_bucket
from app.routers import admin, auth, catalog, favorites, files, orders, reviews, users

logging.basicConfig(level=logging.WARNING, format="%(levelname)s:     %(name)s - %(message)s")
logging.getLogger("app").setLevel(logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_bucket()
    yield


app = FastAPI(
    title="Jysk Clone API",
    description="Бэкенд интернет-магазина (дипломный проект)",
    lifespan=lifespan,
)

# Разрешаем запросы с фронтенда (React на localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StorageUnavailableError)
async def storage_unavailable_handler(request: Request, error: StorageUnavailableError):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Файловое хранилище временно недоступно, попробуйте позже"},
    )


app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(users.router)
app.include_router(reviews.router)
app.include_router(orders.router)
app.include_router(favorites.router)
app.include_router(files.router)
app.include_router(admin.router)


@app.get("/")
def health_check():
    """Проверка, что сервис запущен."""
    return {"status": "ok"}
