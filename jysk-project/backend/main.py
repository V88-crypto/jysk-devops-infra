from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, auth, catalog

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
app.include_router(admin.router)


@app.get("/")
def health_check():
    """Проверка, что сервис запущен."""
    return {"status": "ok"}
