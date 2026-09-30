from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None
    conversation_history: Optional[List[Dict[str, Any]]] = []


class ProductRecommendation(BaseModel):
    id: str
    name: str
    category: str
    price: int
    image: str
    images: List[str] = []
    available: bool = True
    stock: int = 0
    fabric: Optional[str] = None
    sizes: List[str] = []
    color: Optional[str] = None
    slug: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    products: List[ProductRecommendation] = []
    suggestions: List[str] = []
    session_id: str
