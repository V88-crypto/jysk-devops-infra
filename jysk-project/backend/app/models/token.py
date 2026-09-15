from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func, text

from app.database import Base


class RefreshToken(Base):
    __tablename__ = "RefreshTokens"

    id = Column("Id", Integer, primary_key=True)
    token = Column("Token", String(512), unique=True, index=True, nullable=False)
    expires_at = Column("ExpiresAt", DateTime, nullable=False)
    is_revoked = Column("IsRevoked", Boolean, nullable=False, server_default=text("0"))
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)


class PasswordResetToken(Base):
    __tablename__ = "PasswordResetTokens"

    id = Column("Id", Integer, primary_key=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)
    token_hash = Column("TokenHash", String(64), unique=True, index=True, nullable=False)
    expires_at = Column("ExpiresAt", DateTime, nullable=False)
    used_at = Column("UsedAt", DateTime, nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    is_revoked = Column("IsRevoked", Boolean, nullable=False, server_default=text("0"))
