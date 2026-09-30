from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    SELLER = "seller"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default=UserRole.CUSTOMER.value, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
