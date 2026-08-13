from sqlalchemy import DECIMAL, JSON, Column, DateTime, ForeignKey, Integer, String, func

from app.database import Base


class Payment(Base):
    __tablename__ = "Payments"

    id = Column("Id", Integer, primary_key=True)
    order_id = Column("OrderId", Integer, ForeignKey("Orders.Id"), nullable=False)
    provider = Column("Provider", String(64), nullable=False)
    payment_method = Column("PaymentMethod", String(64), nullable=True)
    amount = Column("Amount", DECIMAL(10, 2), nullable=False)
    currency = Column("Currency", String(8), nullable=False, server_default="RON")
    status = Column("Status", String(32), nullable=False)
    payment_token = Column("PaymentToken", String(255), nullable=True)
    transaction_id = Column("TransactionId", String(255), nullable=True)
    response_json = Column("ResponseJson", JSON, nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())
    paid_at = Column("PaidAt", DateTime, nullable=True)
