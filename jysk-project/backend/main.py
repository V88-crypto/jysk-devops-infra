import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, auth, catalog, favorites, orders, reviews, users

logging.basicConfig(level=logging.WARNING, format="%(levelname)s:     %(name)s - %(message)s")
logging.getLogger("app").setLevel(logging.INFO)

app = FastAPI(
    title="Jysk Clone API",
    description="Бэкенд интернет-магазина (дипломный проект)",
)

# Разрешаем запросы с фронтенда (React на localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(users.router)
app.include_router(reviews.router)
app.include_router(orders.router)
app.include_router(favorites.router)
app.include_router(admin.router)


@app.get("/")
def health_check():
    """Проверка, что сервис запущен."""
    return {"status": "ok"}
