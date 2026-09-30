from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class OrderItemSchema(BaseModel):
    id: str  # Product ID
    name: str
    price: int
    quantity: int = Field(..., gt=0)
    size: Optional[str] = "Free Size"
    color: Optional[str] = None
    image: Optional[str] = None


class ShippingAddressSchema(BaseModel):
    fullName: str
    phone: str
    addressLine: str
    city: str
    state: str
    pincode: str
    landmark: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItemSchema] = Field(..., min_length=1)
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: ShippingAddressSchema
    payment_method: Optional[str] = "Cash on Delivery"
    subtotal: int
    shipping_fee: Optional[int] = 0
    total_amount: int
    notes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Confirmed|Tailoring|Dispatched|Delivered|Cancelled)$")


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: Dict[str, Any]
    items: List[Dict[str, Any]]
    subtotal: int
    shipping_fee: int
    total_amount: int
    payment_method: str
    status: str
    tracking_number: Optional[str] = None
    estimated_delivery: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
