from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения.

    Значения читаются из переменных окружения (или файла .env).
    Если переменной нет — используется dev-значение по умолчанию.
    """

    # В Docker строка подключения приходит через переменную окружения DATABASE_URL
    DATABASE_URL: str = "mysql+pymysql://jysk_user:jysk_secure_password@localhost:3306/jysk_db"

    # Секрет для подписи JWT. Дефолт — только для разработки!
    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(env_file=".env")


# Единственный экземпляр настроек на всё приложение
settings = Settings()
