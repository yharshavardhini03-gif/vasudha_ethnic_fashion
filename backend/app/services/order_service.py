import logging
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.variant import ProductVariant
from app.models.order import Order
from app.models.audit import AuditLog
from app.schemas.order import OrderCreate

logger = logging.getLogger(__name__)


class OrderService:
    @staticmethod
    def create_order_transactional(
        db: Session,
        order_data: OrderCreate,
        user_id: Optional[str] = None
    ) -> Order:
        """
        Execute atomic order creation with inventory verification & row-level deduction:
        BEGIN TRANSACTION -> Lock variants/products -> Verify Stock -> Decrease Stock -> Create Order -> COMMIT
        """
        order_id = f"VE-{random.randint(1000, 9999)}"
        tracking_num = f"EXP-VE-{random.randint(100000, 999900)}"
        est_delivery = (datetime.now(timezone.utc) + timedelta(days=4)).strftime("%Y-%m-%d")

        try:
            # 1. Verify and deduct stock for each ordered item
            for item in order_data.items:
                product_id = item.id
                req_qty = item.quantity
                req_size = item.size or "Free Size"
                req_color = item.color

                # Lock the product row
                product = db.query(Product).filter(Product.id == product_id).with_for_update().first()
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Product '{item.name}' ({product_id}) not found."
                    )

                # Check variant stock if variants exist
                variants = db.query(ProductVariant).filter(
                    ProductVariant.product_id == product_id
                ).with_for_update().all()

                if variants and req_size:
                    norm_size = req_size.upper().replace(" ", "")
                    matching_variant = None
                    for v in variants:
                        if v.size.upper().replace(" ", "") == norm_size:
                            if not req_color or req_color.lower() in v.color.lower():
                                matching_variant = v
                                break

                    if matching_variant:
                        if matching_variant.stock < req_qty:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Insufficient stock for '{product.name}' in size {req_size}. Available: {matching_variant.stock}, Requested: {req_qty}"
                            )
                        # Deduct variant stock
                        matching_variant.stock -= req_qty
                    else:
                        if product.stock < req_qty:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock}"
                            )

                if product.stock < req_qty:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Insufficient overall stock for '{product.name}'."
                    )
                product.stock -= req_qty

            # 2. Create the Order entity
            new_order = Order(
                id=order_id,
                user_id=user_id,
                customer_name=order_data.customer_name,
                customer_email=order_data.customer_email,
                customer_phone=order_data.customer_phone,
                shipping_address=order_data.shipping_address.model_dump(),
                items=[item.model_dump() for item in order_data.items],
                subtotal=order_data.subtotal,
                shipping_fee=order_data.shipping_fee,
                total_amount=order_data.total_amount,
                payment_method=order_data.payment_method or "Cash on Delivery",
                status="Confirmed",
                tracking_number=tracking_num,
                estimated_delivery=est_delivery,
                notes=order_data.notes
            )
            db.add(new_order)

            # 3. Audit Log
            audit = AuditLog(
                id=f"aud_{int(datetime.now(timezone.utc).timestamp())}_{random.randint(100, 999)}",
                user_id=user_id,
                action="order_placed",
                details=f"Order {order_id} created for {order_data.customer_name} total ₹{order_data.total_amount}"
            )
            db.add(audit)

            # 4. Commit atomic transaction
            db.commit()
            db.refresh(new_order)
            logger.info(f"✓ Order {order_id} placed successfully with inventory deduction.")
            return new_order

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"Order placement failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unable to process order: {str(e)}"
            )


order_service = OrderService()
