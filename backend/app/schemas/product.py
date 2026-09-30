from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class VariantSchema(BaseModel):
    size: str
    color: str
    stock: int = Field(default=0, ge=0)
    sku: Optional[str] = None


class ProductVariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    product_id: str
    size: str
    color: str
    stock: int
    sku: Optional[str] = None


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., max_length=50)
    sub_category: Optional[str] = None
    price: int = Field(..., gt=0)
    original_price: Optional[int] = None
    rating: Optional[float] = 5.0
    review_count: Optional[int] = 0
    is_new: Optional[bool] = True
    is_best_seller: Optional[bool] = False
    is_featured: Optional[bool] = False
    tag: Optional[str] = None
    fabric: Optional[str] = None
    color: Optional[str] = None
    color_hex: Optional[str] = None
    colors: Optional[List[str]] = []
    sizes: Optional[List[str]] = []
    images: Optional[List[str]] = []
    description: str = Field(..., min_length=5)
    details: Optional[List[str]] = []
    care: Optional[List[str]] = []
    delivery: Optional[Dict[str, Any]] = None
    occasions: Optional[List[str]] = []
    published: Optional[bool] = True
    stock: Optional[int] = 0
    sku: Optional[str] = None


class ProductCreate(ProductBase):
    variants: Optional[List[VariantSchema]] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    price: Optional[int] = None
    original_price: Optional[int] = None
    is_new: Optional[bool] = None
    is_best_seller: Optional[bool] = None
    is_featured: Optional[bool] = None
    tag: Optional[str] = None
    fabric: Optional[str] = None
    color: Optional[str] = None
    color_hex: Optional[str] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    details: Optional[List[str]] = None
    care: Optional[List[str]] = None
    delivery: Optional[Dict[str, Any]] = None
    occasions: Optional[List[str]] = None
    published: Optional[bool] = None
    stock: Optional[int] = None
    sku: Optional[str] = None
    variants: Optional[List[VariantSchema]] = None


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    variants: List[ProductVariantResponse] = []


class StockUpdate(BaseModel):
    stock: int = Field(..., ge=0)


class VariantStockUpdate(BaseModel):
    size: str
    color: str
    stock: int = Field(..., ge=0)
