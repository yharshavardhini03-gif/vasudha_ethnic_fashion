import logging
import uuid
from sqlalchemy.orm import Session
from app.config import settings
from app.database import engine, SessionLocal, Base
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.variant import ProductVariant
from app.security.passwords import hash_password
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

INITIAL_PRODUCTS = [
  {
    "id": "VE001",
    "sku": "VE-ANK-001",
    "name": "Royal Green Anarkali",
    "slug": "royal-green-anarkali",
    "category": "Dresses",
    "sub_category": "Anarkali Suits",
    "price": 2199,
    "original_price": 2999,
    "rating": 4.9,
    "review_count": 52,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Signature Silhouette",
    "fabric": "Georgette",
    "color": "Royal Green",
    "color_hex": "#0C3B10",
    "colors": ["Green", "Maroon"],
    "sizes": ["S", "M", "L", "XL"],
    "variants": [
      {"size": "S", "color": "Green", "stock": 4},
      {"size": "M", "color": "Green", "stock": 5},
      {"size": "L", "color": "Green", "stock": 2},
      {"size": "XL", "color": "Green", "stock": 0},
      {"size": "M", "color": "Maroon", "stock": 3}
    ],
    "stock": 14,
    "images": [
      "/hero-main.jpg",
      "/half-saree-orange.jpg"
    ],
    "description": "Elegant royal green ethnic wear Anarkali designed for celebratory weddings and festive occasions with intricate threadwork.",
    "details": [
      "Pure flowy georgette with micro-zari bodice embroidery",
      "Full 4.5m flare with attached santoon lining",
      "Includes tailored churidar pants and matching sheer dupatta"
    ],
    "care": [
      "Dry clean recommended",
      "Steam iron on low heat"
    ],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Wedding", "Festive", "Reception", "Sangeet"]
  },
  {
    "id": "VE002",
    "sku": "VE-KRT-002",
    "name": "Maroon Silk Kurta Set",
    "slug": "maroon-silk-kurta-set",
    "category": "Kurtis",
    "sub_category": "Kurta Sets",
    "price": 1899,
    "original_price": 2699,
    "rating": 4.8,
    "review_count": 34,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Festive Essential",
    "fabric": "Silk",
    "color": "Deep Maroon",
    "color_hex": "#881337",
    "colors": ["Maroon", "Gold"],
    "sizes": ["S", "M", "L", "XL"],
    "variants": [
      {"size": "S", "color": "Maroon", "stock": 3},
      {"size": "M", "color": "Maroon", "stock": 6},
      {"size": "L", "color": "Maroon", "stock": 4},
      {"size": "XL", "color": "Maroon", "stock": 2}
    ],
    "stock": 15,
    "images": [
      "/cotton-churidar-rust.jpg"
    ],
    "description": "Sophisticated pure silk straight kurta paired with matching tailored trousers and a gold printed brocade dupatta.",
    "details": [
      "100% pure art silk weave with golden foil accents",
      "Side slits with comfortable regular fit",
      "Elasticated waistband trousers with pockets"
    ],
    "care": ["Gentle hand wash", "Dry in shade"],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Festive Puja", "Family Gatherings", "Office Celebrations"]
  },
  {
    "id": "VE003",
    "sku": "VE-SAR-003",
    "name": "Ivory Embroidered Saree",
    "slug": "ivory-embroidered-saree",
    "category": "Sarees",
    "sub_category": "Silk Sarees",
    "price": 3299,
    "original_price": 4599,
    "rating": 4.9,
    "review_count": 41,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Heirloom Weave",
    "fabric": "Silk Organza",
    "color": "Ivory",
    "color_hex": "#F3ECE2",
    "colors": ["Ivory", "Champagne Gold"],
    "sizes": ["Free Size"],
    "variants": [
      {"size": "Free Size", "color": "Ivory", "stock": 8}
    ],
    "stock": 8,
    "images": [
      "/half-saree-kalamkari.jpg",
      "/half-saree-orange.jpg"
    ],
    "description": "Timeless ivory silk organza saree with delicate floral resham embroidery and scalloped zari edges.",
    "details": [
      "Featherweight sheer organza drape",
      "Includes unstitched 0.8m pure silk designer blouse piece",
      "Hand-finished scalloped border"
    ],
    "care": ["Dry clean only", "Store wrapped in muslin cloth"],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Day Wedding", "Haldi", "Cocktails", "Reception"]
  },
  {
    "id": "VE004",
    "sku": "VE-LHG-004",
    "name": "Gold Festive Lehenga",
    "slug": "gold-festive-lehenga",
    "category": "Lehengas",
    "sub_category": "Bridal & Festive",
    "price": 8499,
    "original_price": 12999,
    "rating": 5.0,
    "review_count": 28,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Bridal Edition",
    "fabric": "Raw Silk",
    "color": "Gold",
    "color_hex": "#DBAB7D",
    "colors": ["Gold", "Pink"],
    "sizes": ["S", "M", "L"],
    "variants": [
      {"size": "S", "color": "Gold", "stock": 2},
      {"size": "M", "color": "Gold", "stock": 4},
      {"size": "L", "color": "Gold", "stock": 2}
    ],
    "stock": 8,
    "images": [
      "/hero-main.jpg",
      "/bridal-lehenga-pastel.jpg"
    ],
    "description": "Shimmering antique gold handcrafted festive lehenga adorned with zardozi, sequins, and double can-can lining.",
    "details": [
      "5.5 meter circular flare with heavy flared hem",
      "Padded sweetheart blouse with tassel dori back",
      "Embroidered net veil dupatta included"
    ],
    "care": ["Specialist dry clean only", "Preserve in keepsake box"],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Wedding Bride", "Sangeet Night", "Grand Reception"]
  },
  {
    "id": "VE005",
    "sku": "VE-HS-005",
    "name": "Royal Orange & Lavender Silk Half Saree",
    "slug": "royal-orange-lavender-silk-half-saree",
    "category": "Sarees",
    "sub_category": "Half Sarees",
    "price": 3899,
    "original_price": 5999,
    "rating": 4.9,
    "review_count": 48,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Exclusive Weave",
    "fabric": "Silk",
    "color": "Orange & Lavender",
    "color_hex": "#EA580C",
    "colors": ["Orange", "Lavender", "Gold"],
    "sizes": ["Free Size"],
    "variants": [
      {"size": "Free Size", "color": "Orange & Lavender", "stock": 6},
      {"size": "Free Size", "color": "Gold", "stock": 3}
    ],
    "stock": 9,
    "images": [
      "/half-saree-orange.jpg",
      "/half-saree-kalamkari.jpg"
    ],
    "description": "An authentic Vasudha half saree featuring a radiant pleated lavender zari skirt with rich golden border and orange silk drape.",
    "details": [
      "Authentic Vasudha handloom pure silk weave",
      "Heavy zari temple border with check grid brocade",
      "Includes embellished unstitched blouse fabric",
      "Kakinada flagship boutique edition"
    ],
    "care": ["Dry clean only", "Wrap in breathable muslin cover"],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Half Saree Function", "Weddings", "Festive Celebrations"]
  },
  {
    "id": "VE006",
    "sku": "VE-LHG-006",
    "name": "Pastel Sky Blue Handcrafted Bridal Lehanga",
    "slug": "pastel-sky-blue-handcrafted-bridal-lehanga",
    "category": "Lehengas",
    "sub_category": "Bridal Lehengas",
    "price": 9999,
    "original_price": 14999,
    "rating": 5.0,
    "review_count": 33,
    "is_new": True,
    "is_best_seller": True,
    "is_featured": True,
    "tag": "Be The Best Bride",
    "fabric": "Silk",
    "color": "Sky Blue",
    "color_hex": "#38BDF8",
    "colors": ["Sky Blue", "Mint Aqua"],
    "sizes": ["XS", "S", "M", "L", "XL"],
    "variants": [
      {"size": "XS", "color": "Sky Blue", "stock": 2},
      {"size": "S", "color": "Sky Blue", "stock": 3},
      {"size": "M", "color": "Sky Blue", "stock": 4},
      {"size": "L", "color": "Sky Blue", "stock": 2}
    ],
    "stock": 11,
    "images": [
      "/bridal-lehenga-pastel.jpg",
      "/hero-main.jpg"
    ],
    "description": "Ethereal pastel sky blue bridal lehanga with intricate silver and champagne zari filigree and peacock motif embroidery.",
    "details": [
      "Intricate hand-embroidered peacock & floral zari detailing",
      "Full circular flare with heavy scalloped hemline",
      "Includes sheer matching bridal veil dupatta and structured blouse"
    ],
    "care": ["Specialist dry clean only"],
    "delivery": {
      "time": "3–5 days",
      "shippingCharge": 99,
      "freeThreshold": 999,
      "returnAvailable": True,
      "returnPeriod": "7 days"
    },
    "published": True,
    "occasions": ["Bridal Day", "Grand Reception", "Engagement", "Sangeet"]
  }
]


def init_db_data():
    """Create all tables and seed default accounts + products with embeddings without overwriting existing data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Provision Single Authorized Seller (from environment variables)
        existing_seller = db.query(User).filter(User.role == UserRole.SELLER.value).first()
        if not existing_seller:
            seller = User(
                id=f"usr_seller_{uuid.uuid4().hex[:8]}",
                user_id=settings.INITIAL_SELLER_USER_ID,
                name=settings.INITIAL_SELLER_NAME,
                email=settings.INITIAL_SELLER_EMAIL.lower().strip(),
                phone=settings.INITIAL_SELLER_PHONE,
                role=UserRole.SELLER.value,
                hashed_password=hash_password(settings.INITIAL_SELLER_PASSWORD),
                is_active=True
            )
            db.add(seller)
            logger.info(f"✓ Provisioned initial single seller account ({settings.INITIAL_SELLER_EMAIL})")
        else:
            logger.info(f"✓ Single seller account ({existing_seller.email}) already provisioned. Skipping seller creation.")

        # 2. Seed Initial Products without overwriting existing entries
        for pdata in INITIAL_PRODUCTS:
            existing = db.query(Product).filter(Product.id == pdata["id"]).first()
            if not existing:
                doc_text = embedding_service.build_product_document(pdata)
                emb = embedding_service.get_embedding(doc_text)

                prod = Product(
                    id=pdata["id"],
                    sku=pdata["sku"],
                    name=pdata["name"],
                    slug=pdata["slug"],
                    category=pdata["category"],
                    sub_category=pdata.get("sub_category"),
                    price=pdata["price"],
                    original_price=pdata.get("original_price"),
                    rating=pdata.get("rating", 5.0),
                    review_count=pdata.get("review_count", 10),
                    is_new=pdata.get("is_new", True),
                    is_best_seller=pdata.get("is_best_seller", False),
                    is_featured=pdata.get("is_featured", True),
                    tag=pdata.get("tag"),
                    fabric=pdata.get("fabric"),
                    color=pdata.get("color"),
                    color_hex=pdata.get("color_hex"),
                    colors=pdata.get("colors", []),
                    sizes=pdata.get("sizes", []),
                    images=pdata.get("images", []),
                    description=pdata["description"],
                    details=pdata.get("details", []),
                    care=pdata.get("care", []),
                    delivery=pdata.get("delivery", {}),
                    occasions=pdata.get("occasions", []),
                    published=pdata.get("published", True),
                    stock=pdata.get("stock", 0),
                    embedding=emb
                )
                db.add(prod)

                for v in pdata.get("variants", []):
                    var = ProductVariant(
                        id=f"var_{pdata['id']}_{v['size']}_{v['color']}".replace(" ", "_"),
                        product_id=pdata["id"],
                        size=v["size"],
                        color=v["color"],
                        stock=v["stock"],
                        sku=f"{pdata['sku']}-{v['size']}-{v['color']}".replace(" ", "")
                    )
                    db.add(var)

                logger.info(f"✓ Seeded product {pdata['name']} (ID: {pdata['id']})")

        db.commit()
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db_data()
