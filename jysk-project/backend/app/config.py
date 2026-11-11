from decimal import Decimal

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
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://localhost:3000"

    SMTP_HOST: str = ""
    SMTP_PORT: int = 1025
    SMTP_FROM: str = "noreply@jysk-clone.local"

    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = ""
    MINIO_SECRET_KEY: str = ""
    MINIO_BUCKET: str = "images"
    MINIO_SECURE: bool = False

    PUBLIC_API_URL: str = "http://localhost:8000"
    MEDIA_TRUSTED_HOSTS: str = ""
    MAX_UPLOAD_SIZE_MB: int = 5

    DELIVERY_PRICE_NP_COURIER: Decimal = Decimal("150")
    DELIVERY_PRICE_NP_DEPARTMENT: Decimal = Decimal("80")
    FREE_DELIVERY_FROM: Decimal = Decimal("5000")
    VAT_RATE: Decimal = Decimal("20")

    model_config = SettingsConfigDict(env_file=".env")


# Единственный экземпляр настроек на всё приложение
settings = Settings()
