import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def send_password_reset_email(email: str, reset_url: str) -> None:
    if not settings.SMTP_HOST:
        logger.info(
            "SMTP_HOST не задан, письмо не отправлено. Ссылка для сброса пароля для %s: %s",
            email,
            reset_url,
        )
        return

    message = EmailMessage()
    message["Subject"] = "Восстановление пароля Jysk Clone"
    message["From"] = settings.SMTP_FROM
    message["To"] = email
    message.set_content(
        "Вы запросили восстановление пароля.\n\n"
        f"Чтобы задать новый пароль, перейдите по ссылке:\n{reset_url}\n\n"
        f"Ссылка действует {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} минут. "
        "Если вы не запрашивали восстановление, просто проигнорируйте это письмо."
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
            smtp.send_message(message)
    except Exception as error:
        logger.error("Не удалось отправить письмо для сброса пароля на %s: %s", email, error)
