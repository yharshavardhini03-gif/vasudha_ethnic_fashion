from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base, IS_POSTGRES

try:
    if IS_POSTGRES:
        from pgvector.sqlalchemy import Vector
        EmbeddingType = Vector(384)
    else:
        EmbeddingType = JSON
except Exception:
    EmbeddingType = JSON


class Product(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    sub_category = Column(String(100), nullable=True)
    price = Column(Integer, nullable=False, index=True)
    original_price = Column(Integer, nullable=True)
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    is_new = Column(Boolean, default=True)
    is_best_seller = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    tag = Column(String(100), nullable=True)
    fabric = Column(String(100), nullable=True)
    color = Column(String(50), nullable=True)
    color_hex = Column(String(20), nullable=True)
    colors = Column(JSON, default=list)
    sizes = Column(JSON, default=list)
    images = Column(JSON, default=list)
    description = Column(Text, nullable=False)
    details = Column(JSON, default=list)
    care = Column(JSON, default=list)
    delivery = Column(JSON, default=dict)
    occasions = Column(JSON, default=list)
    published = Column(Boolean, default=True, index=True)
    stock = Column(Integer, default=0)
    embedding = Column(EmbeddingType, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan", lazy="joined")
