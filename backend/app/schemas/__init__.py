from app.schemas.auth import UserRegister, UserLogin, UserResponse, Token, TokenData
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    VariantSchema,
    ProductVariantResponse,
    StockUpdate,
    VariantStockUpdate
)
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.schemas.chat import ChatRequest, ChatResponse, ProductRecommendation

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenData",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "VariantSchema",
    "ProductVariantResponse",
    "StockUpdate",
    "VariantStockUpdate",
    "OrderCreate",
    "OrderStatusUpdate",
    "OrderResponse",
    "ChatRequest",
    "ChatResponse",
    "ProductRecommendation"
]
