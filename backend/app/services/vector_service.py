import logging
import numpy as np
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.product import Product
from app.services.embedding_service import embedding_service
from app.database import IS_POSTGRES

logger = logging.getLogger(__name__)


def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Compute cosine similarity between two normalized vectors."""
    try:
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a < 1e-6 or norm_b < 1e-6:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
    except Exception:
        return 0.0


class VectorService:
    @staticmethod
    def hybrid_search(
        db: Session,
        query_text: str,
        constraints: Dict[str, Any],
        top_k: int = 5
    ) -> List[Tuple[Product, float]]:
        """
        Execute Hybrid Search combining:
        1. Local Vector Semantic Search
        2. Keyword Search (ILIKE query)
        3. Structured Hard Filters (max_price, size, category, published=True)
        """
        # Generate query vector locally
        query_vector = embedding_service.get_embedding(query_text)

        # Base query: only published products
        query = db.query(Product).filter(Product.published == True)

        # Apply strict price constraints if detected
        if constraints.get("max_price") is not None:
            query = query.filter(Product.price <= constraints["max_price"])
        if constraints.get("min_price") is not None:
            query = query.filter(Product.price >= constraints["min_price"])

        # Apply category constraint if detected
        if constraints.get("category"):
            target_cat = constraints["category"]
            query = query.filter(
                or_(
                    Product.category.ilike(f"%{target_cat}%"),
                    Product.sub_category.ilike(f"%{target_cat}%"),
                    Product.name.ilike(f"%{target_cat}%")
                )
            )

        products = query.all()
        if not products:
            # If strict category yielded nothing, relax category filter ONLY while keeping price constraints intact
            if constraints.get("category"):
                relaxed_query = db.query(Product).filter(Product.published == True)
                if constraints.get("max_price") is not None:
                    relaxed_query = relaxed_query.filter(Product.price <= constraints["max_price"])
                if constraints.get("min_price") is not None:
                    relaxed_query = relaxed_query.filter(Product.price >= constraints["min_price"])
                products = relaxed_query.all()

        # If a budget constraint was specified and no products match, do NOT fall back to expensive products!
        if not products and constraints.get("max_price") is not None:
            return []

        if not products:
            # Only fall back to all published products if no hard budget was violated
            products = db.query(Product).filter(Product.published == True).all()

        if not products:
            return []

        # Score each candidate product with hybrid semantic + keyword + metadata match
        query_words = set(query_text.lower().split())
        target_size = constraints.get("size")
        target_color = constraints.get("color")
        target_occ = constraints.get("occasion")

        scored_candidates: List[Tuple[Product, float]] = []

        for p in products:
            score = 0.0

            # 1. Vector Semantic Similarity
            p_vec = p.embedding
            if p_vec is not None:
                if isinstance(p_vec, list):
                    sem_sim = _cosine_similarity(query_vector, p_vec)
                elif hasattr(p_vec, "tolist"):
                    sem_sim = _cosine_similarity(query_vector, p_vec.tolist())
                else:
                    try:
                        # pgvector representation
                        sem_sim = _cosine_similarity(query_vector, list(p_vec))
                    except Exception:
                        sem_sim = 0.5
            else:
                sem_sim = 0.3

            score += sem_sim * 0.50

            # 2. Keyword lexical overlap
            product_text = f"{p.name} {p.category} {p.sub_category or ''} {p.fabric or ''} {p.description}".lower()
            matching_words = [w for w in query_words if len(w) > 2 and w in product_text]
            keyword_score = min(1.0, len(matching_words) * 0.25)
            score += keyword_score * 0.25

            # 3. Size match boost
            if target_size:
                p_sizes = [s.upper() for s in (p.sizes or [])]
                if target_size.upper() in p_sizes or "FREE SIZE" in p_sizes:
                    score += 0.15

            # 4. Color match boost
            if target_color:
                p_color = (p.color or "").lower()
                p_colors = [c.lower() for c in (p.colors or [])]
                if target_color in p_color or any(target_color in c for c in p_colors):
                    score += 0.10

            # 5. Occasion match boost
            if target_occ:
                p_occ = [o.lower() for o in (p.occasions or [])]
                if any(target_occ in o for o in p_occ) or target_occ in p.description.lower():
                    score += 0.10

            scored_candidates.append((p, score))

        # Sort by hybrid score descending
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        return scored_candidates[:top_k]


vector_service = VectorService()
