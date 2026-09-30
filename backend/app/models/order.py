from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    shipping_address = Column(JSON, nullable=False)
    items = Column(JSON, nullable=False)  # List of ordered product items with size, color, quantity, price
    subtotal = Column(Integer, nullable=False)
    shipping_fee = Column(Integer, default=0)
    total_amount = Column(Integer, nullable=False)
    payment_method = Column(String(30), default="Cash on Delivery")
    status = Column(String(30), default="Confirmed", index=True)  # Confirmed, Tailoring, Dispatched, Delivered, Cancelled
    tracking_number = Column(String(50), nullable=True)
    estimated_delivery = Column(String(50), nullable=True)
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
