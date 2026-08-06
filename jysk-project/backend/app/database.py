from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# Движок SQLAlchemy. pool_pre_ping проверяет соединение перед использованием,
# т.к. MySQL закрывает простаивающие соединения.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Фабрика сессий: одна сессия на один HTTP-запрос
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для всех моделей
Base = declarative_base()


def get_db():
    """Зависимость FastAPI: выдаёт сессию БД и закрывает её после запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
