import uuid
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.product import Product
from app.models.variant import ProductVariant
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    StockUpdate,
    VariantStockUpdate
)
from app.security.deps import require_seller, get_optional_user
from app.services.embedding_service import embedding_service
from app.services.storage_service import storage_service

router = APIRouter(prefix="/products", tags=["Products"])


def slugify(text: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s-]+", "-", cleaned)


@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = None,
    fabric: Optional[str] = None,
    color: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    search: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_new: Optional[bool] = None,
    include_unpublished: Optional[bool] = False,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """Retrieve catalog products with rich filtering."""
    query = db.query(Product)

    is_seller = user and user.role in ["seller", "admin"]
    if not (is_seller and include_unpublished):
        query = query.filter(Product.published == True)

    if category and category != "All":
        query = query.filter(
            or_(
                Product.category.ilike(f"%{category}%"),
                Product.sub_category.ilike(f"%{category}%")
            )
        )

    if fabric:
        query = query.filter(Product.fabric.ilike(f"%{fabric}%"))

    if color:
        query = query.filter(Product.color.ilike(f"%{color}%"))

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    if is_new is not None:
        query = query.filter(Product.is_new == is_new)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(s),
                Product.category.ilike(s),
                Product.description.ilike(s),
                Product.fabric.ilike(s)
            )
        )

    products = query.order_by(Product.created_at.desc()).all()
    return [ProductResponse.model_validate(p) for p in products]


@router.get("/{id_or_slug}", response_model=ProductResponse)
def get_product(id_or_slug: str, db: Session = Depends(get_db)):
    """Retrieve a single product by ID or slug."""
    product = db.query(Product).filter(
        (Product.id == id_or_slug) | (Product.slug == id_or_slug)
    ).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{id_or_slug}' not found."
        )

    return ProductResponse.model_validate(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Create a new product and generate local vector embedding."""
    product_id = f"VE{uuid.uuid4().hex[:6].upper()}"
    base_slug = slugify(product_in.name)
    slug = f"{base_slug}-{product_id.lower()}"

    total_stock = product_in.stock or 0
    if product_in.variants:
        total_stock = sum(v.stock for v in product_in.variants)

    prod_dict = product_in.model_dump()
    doc_text = embedding_service.build_product_document(prod_dict)
    embedding_vector = embedding_service.get_embedding(doc_text)

    product = Product(
        id=product_id,
        sku=product_in.sku or f"VE-{product_id}",
        name=product_in.name,
        slug=slug,
        category=product_in.category,
        sub_category=product_in.sub_category,
        price=product_in.price,
        original_price=product_in.original_price or int(product_in.price * 1.3),
        rating=product_in.rating or 5.0,
        review_count=product_in.review_count or 1,
        is_new=product_in.is_new,
        is_best_seller=product_in.is_best_seller,
        is_featured=product_in.is_featured,
        tag=product_in.tag,
        fabric=product_in.fabric,
        color=product_in.color,
        color_hex=product_in.color_hex,
        colors=product_in.colors or [],
        sizes=product_in.sizes or [],
        images=product_in.images or ["/logo.png"],
        description=product_in.description,
        details=product_in.details or [],
        care=product_in.care or [],
        delivery=product_in.delivery or {"time": "3–5 days", "shippingCharge": 99, "freeThreshold": 999},
        occasions=product_in.occasions or [],
        published=product_in.published if product_in.published is not None else True,
        stock=total_stock,
        embedding=embedding_vector
    )

    db.add(product)

    if product_in.variants:
        for v in product_in.variants:
            variant_obj = ProductVariant(
                id=f"var_{uuid.uuid4().hex[:10]}",
                product_id=product_id,
                size=v.size,
                color=v.color,
                stock=v.stock,
                sku=v.sku or f"{product.sku}-{v.size}-{v.color}"
            )
            db.add(variant_obj)

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:10]}",
        user_id=seller.user_id,
        action="create_product",
        details=f"Created product {product.name} (ID: {product_id}, Stock: {total_stock})"
    )
    db.add(audit)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Update product and re-index vector embedding if text changed."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_id}' not found."
        )

    update_data = product_in.model_dump(exclude_unset=True)
    text_fields_changed = any(k in update_data for k in ["name", "description", "category", "fabric", "price", "details"])

    for field, val in update_data.items():
        if field != "variants" and hasattr(product, field):
            setattr(product, field, val)

    if product_in.variants is not None:
        db.query(ProductVariant).filter(ProductVariant.product_id == product_id).delete()
        total_v_stock = 0
        for v in product_in.variants:
            total_v_stock += v.stock
            var_obj = ProductVariant(
                id=f"var_{uuid.uuid4().hex[:10]}",
                product_id=product_id,
                size=v.size,
                color=v.color,
                stock=v.stock,
                sku=v.sku or f"{product.sku}-{v.size}-{v.color}"
            )
            db.add(var_obj)
        product.stock = total_v_stock

    if text_fields_changed:
        doc_text = embedding_service.build_product_document({
            "name": product.name,
            "category": product.category,
            "sub_category": product.sub_category,
            "price": product.price,
            "fabric": product.fabric,
            "sizes": product.sizes,
            "colors": product.colors,
            "occasions": product.occasions,
            "description": product.description,
            "details": product.details
        })
        product.embedding = embedding_service.get_embedding(doc_text)

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:10]}",
        user_id=seller.user_id,
        action="update_product",
        details=f"Updated product {product.name} ({product_id})"
    )
    db.add(audit)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Remove a product from the boutique catalog."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_id}' not found."
        )

    prod_name = product.name
    db.delete(product)

    audit = AuditLog(
        id=f"aud_{uuid.uuid4().hex[:10]}",
        user_id=seller.user_id,
        action="delete_product",
        details=f"Deleted product {prod_name} ({product_id})"
    )
    db.add(audit)

    db.commit()
    return {"message": f"Product '{prod_name}' successfully removed.", "id": product_id}


@router.patch("/{product_id}/stock", response_model=ProductResponse)
def update_product_stock(
    product_id: str,
    stock_in: StockUpdate,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Fast live inventory update without re-embedding."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    product.stock = stock_in.stock
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.patch("/{product_id}/variants/stock", response_model=ProductResponse)
def update_variant_stock(
    product_id: str,
    v_stock: VariantStockUpdate,
    db: Session = Depends(get_db),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Update a specific variant size/color stock in live DB."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    variant = db.query(ProductVariant).filter(
        ProductVariant.product_id == product_id,
        ProductVariant.size.ilike(v_stock.size),
        ProductVariant.color.ilike(v_stock.color)
    ).first()

    if variant:
        variant.stock = v_stock.stock
    else:
        variant = ProductVariant(
            id=f"var_{uuid.uuid4().hex[:10]}",
            product_id=product_id,
            size=v_stock.size,
            color=v_stock.color,
            stock=v_stock.stock,
            sku=f"{product.sku}-{v_stock.size}-{v_stock.color}"
        )
        db.add(variant)

    db.flush()
    all_variants = db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()
    product.stock = sum(v.stock for v in all_variants)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...),
    seller: User = Depends(require_seller)
):
    """Seller Endpoint: Upload and validate product photo."""
    img_url = await storage_service.save_product_image(file)
    return {"url": img_url, "filename": file.filename}
