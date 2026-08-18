from sqlalchemy import DECIMAL, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class Address(Base):
    __tablename__ = "Addresses"

    id = Column("Id", Integer, primary_key=True)
    provider = Column("Provider", String(64), nullable=True)
    external_city_id = Column("ExternalCityId", String(64), nullable=True)
    external_address_id = Column("ExternalAddressId", String(64), nullable=True)
    city = Column("City", String(255), nullable=False)
    address = Column("Address", String(512), nullable=False)
    postal_code = Column("PostalCode", String(16), nullable=True)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())


class Order(Base):
    __tablename__ = "Orders"

    id = Column("Id", Integer, primary_key=True)
    user_id = Column("UserId", Integer, ForeignKey("Users.Id"), nullable=False)
    address_id = Column("AddressId", Integer, ForeignKey("Addresses.Id"), nullable=False)
    status = Column("Status", String(32), nullable=False, server_default="new")
    total_price = Column("TotalPrice", DECIMAL(10, 2), nullable=False)
    created_at = Column("CreatedAt", DateTime, nullable=False, server_default=func.now())

    items = relationship("OrderItem", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "OrderItems"

    id = Column("Id", Integer, primary_key=True)
    order_id = Column("OrderId", Integer, ForeignKey("Orders.Id"), nullable=False)
    variant_id = Column("VariantId", Integer, ForeignKey("ProductVariants.Id"), nullable=False)
    quantity = Column("Quantity", Integer, nullable=False)
    price = Column("Price", DECIMAL(10, 2), nullable=False)
