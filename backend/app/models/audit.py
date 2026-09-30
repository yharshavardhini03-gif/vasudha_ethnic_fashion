from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(60), primary_key=True, index=True)
    user_id = Column(String(50), nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # create_product, update_stock, delete_product, order_placed
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
