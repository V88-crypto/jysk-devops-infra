# Jysk Clone — Backend

Бэкенд интернет-магазина (дипломный проект): REST API на FastAPI с регистрацией
и авторизацией пользователей через JWT.

**Стек:** FastAPI, SQLAlchemy, Alembic, MySQL 8, PyMySQL, python-jose (JWT), passlib (bcrypt).

## Структура

```
backend/
├── main.py             # точка входа: создание app, CORS, роутеры
├── requirements.txt
├── alembic/            # миграции БД
├── alembic.ini
└── app/
    ├── config.py       # настройки из переменных окружения
    ├── database.py     # engine, сессии, Base, get_db
    ├── models/         # модели SQLAlchemy (таблицы Users, Roles)
    ├── schemas/        # Pydantic-схемы запросов/ответов
    ├── routers/        # эндпоинты (auth)
    └── core/           # хеширование паролей, JWT
```

## Запуск локально

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API: http://localhost:8000, документация Swagger: http://localhost:8000/docs

## Переменные окружения

| Переменная     | Описание                     | Значение по умолчанию (dev)                     |
|----------------|------------------------------|-------------------------------------------------|
| `DATABASE_URL` | строка подключения к MySQL   | `mysql+pymysql://jysk:jysk@localhost:3306/jysk_db` |
| `JWT_SECRET`   | секрет для подписи токенов   | dev-значение, в проде задать своё               |

В Docker `DATABASE_URL` передаётся контейнеру через окружение (настроено в devops).
Локально переменные можно положить в файл `.env`.

## Миграции

```
alembic upgrade head                          # применить все миграции
alembic revision --autogenerate -m "текст"    # создать новую миграцию по моделям
```

В Docker миграции выполняются внутри контейнера backend той же командой
`alembic upgrade head`.

## Эндпоинты

| Метод | Путь             | Описание                                      |
|-------|------------------|-----------------------------------------------|
| GET   | `/`              | health-check, возвращает `{"status": "ok"}`   |
| POST  | `/auth/register` | регистрация, возвращает токен + пользователя  |
| POST  | `/auth/login`    | вход, возвращает `access_token` (bearer)      |
