from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator


class CustomerRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full Name")
    email: EmailStr = Field(..., description="Customer Email")
    user_id: Optional[str] = Field(default=None, max_length=50, description="Optional Username")
    password: str = Field(..., min_length=6, max_length=100, description="Account Password")
    confirm_password: Optional[str] = Field(default=None, max_length=100, description="Confirm Password")
    phone: Optional[str] = Field(default=None, max_length=20, description="Phone Number")
    role: Optional[str] = Field(default="customer")

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.confirm_password is not None and self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


# Backward compatibility alias
UserRegister = CustomerRegister


class CustomerLogin(BaseModel):
    user_id: str = Field(..., description="Email or Username")
    password: str = Field(..., description="Password")


# Backward compatibility alias
UserLogin = CustomerLogin


class SellerLogin(BaseModel):
    email: Optional[str] = Field(default=None, description="Seller Email")
    user_id: Optional[str] = Field(default=None, description="Seller User ID or Email")
    password: str = Field(..., description="Seller Password")


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

