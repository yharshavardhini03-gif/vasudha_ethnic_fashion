from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order
from app.models.user import User, UserRole
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.security.deps import get_optional_user, require_seller, get_current_user
from app.services.order_service import order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """Place a new order with atomic transactional inventory deduction."""
    user_id = user.user_id if user else None
    order_obj = order_service.create_order_transactional(db, order_in, user_id=user_id)
    return OrderResponse.model_validate(order_obj)


@router.get("", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    List orders:
    - Seller / Admin sees all boutique orders.
    - Customer sees strictly their own order history.
    """
    if user.role in [UserRole.SELLER.value, UserRole.ADMIN.value]:
        orders = db.query(Order).order_by(Order.created_at.desc()).all()
    else:
        orders = db.query(Order).filter(
            (Order.user_id == user.user_id) | (Order.customer_email == user.email)
        ).order_by(Order.created_at.desc()).all()

    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Retrieve details for a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    is_seller = user.role in [UserRole.SELLER.value, UserRole.ADMIN.value]
    is_owner = order.user_id == user.user_id or order.customer_email.lower() == user.email.lower()

    if not (is_seller or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not authorized to view this order."
        )

    return OrderResponse.model_validate(order)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Update order fulfillment status (Confirmed -> Tailoring -> Dispatched -> Delivered)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    order.status = status_in.status
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)
