import logging
from typing import Dict, Any, Optional, Tuple, List
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.variant import ProductVariant

logger = logging.getLogger(__name__)


class InventoryService:
    @staticmethod
    def get_live_product_stock(db: Session, product_id: str) -> Dict[str, Any]:
        """Query real-time database stock for a product and all its size/color variants."""
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return {"available": False, "total_stock": 0, "variants": []}

        variants = db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()

        variant_info = []
        total_variant_stock = 0
        for v in variants:
            total_variant_stock += v.stock
            variant_info.append({
                "size": v.size,
                "color": v.color,
                "stock": v.stock,
                "in_stock": v.stock > 0
            })

        effective_stock = total_variant_stock if variants else product.stock

        return {
            "available": effective_stock > 0,
            "total_stock": effective_stock,
            "variants": variant_info,
            "sizes": product.sizes or [],
            "colors": product.colors or []
        }

    @staticmethod
    def check_variant_availability(
        db: Session,
        product_id: str,
        size: Optional[str] = None,
        color: Optional[str] = None
    ) -> Tuple[bool, int, str]:
        """
        Check whether a specific size/color combination is in stock.
        Returns: (is_available, stock_count, descriptive_status)
        """
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return False, 0, "Product not found"

        variants = db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()

        if variants and size:
            norm_size = size.upper().replace(" ", "")
            matching = [
                v for v in variants
                if v.size.upper().replace(" ", "") == norm_size
                and (not color or color.lower() in v.color.lower())
            ]
            if matching:
                total_stock = sum(v.stock for v in matching)
                if total_stock > 0:
                    return True, total_stock, f"Available in size {size} ({total_stock} in stock)"
                else:
                    return False, 0, f"Size {size} is currently out of stock"
            else:
                return False, 0, f"Size {size} is not offered for this design"

        # Fallback to total product stock
        if product.stock > 0:
            return True, product.stock, f"In stock ({product.stock} units available)"
        return False, 0, "Currently out of stock"


inventory_service = InventoryService()
