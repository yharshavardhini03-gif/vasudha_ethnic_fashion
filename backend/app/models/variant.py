from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(String(60), primary_key=True, index=True)
    product_id = Column(String(50), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    size = Column(String(30), nullable=False)
    color = Column(String(50), nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    sku = Column(String(60), nullable=True)

    product = relationship("Product", back_populates="variants")
