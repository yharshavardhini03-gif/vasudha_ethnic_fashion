import hashlib
import logging
import numpy as np
from typing import List, Union
from app.config import settings

logger = logging.getLogger(__name__)

_model = None
_model_initialized = False


def _load_model():
    """Lazy load the sentence transformer embedding model locally on CPU."""
    global _model, _model_initialized
    if _model_initialized:
        return _model

    try:
        from sentence_transformers import SentenceTransformer
        logger.info(f"Loading local embedding model: {settings.EMBEDDING_MODEL}...")
        _model = SentenceTransformer(settings.EMBEDDING_MODEL, device="cpu")
        _model_initialized = True
        logger.info(f"✓ Local embedding model '{settings.EMBEDDING_MODEL}' loaded successfully on CPU.")
    except Exception as e:
        logger.warning(
            f"SentenceTransformer local model loading notice: {e}. "
            f"Using local deterministic high-dimensional feature embedder for zero-crash offline execution."
        )
        _model = None
        _model_initialized = True

    return _model


def _fallback_deterministic_embed(text: str, dim: int = 384) -> List[float]:
    """
    Deterministic normalized 384-dimension embedding fallback
    based on character n-grams and hashing. Ensures vector search operates
    smoothly even if offline without model weights.
    """
    cleaned = text.lower().strip()
    words = cleaned.split()
    vec = np.zeros(dim, dtype=np.float32)

    # Word level hashing
    for word in words:
        h = int(hashlib.sha256(word.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if ((h >> 8) & 1) else -1.0
        vec[idx] += sign * (1.0 + len(word) * 0.1)

    # Bigram hashing for contextual phrases
    for i in range(len(words) - 1):
        bigram = f"{words[i]}_{words[i+1]}"
        h = int(hashlib.sha256(bigram.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if ((h >> 8) & 1) else -1.0
        vec[idx] += sign * 1.5

    # L2 Normalization
    norm = np.linalg.norm(vec)
    if norm > 1e-6:
        vec = vec / norm
    else:
        vec[0] = 1.0

    return vec.tolist()


class EmbeddingService:
    @staticmethod
    def get_embedding(text: str) -> List[float]:
        """Generate local embedding vector for text query or product."""
        if not text:
            return [0.0] * settings.EMBEDDING_DIM

        model = _load_model()
        if model is not None:
            try:
                emb = model.encode(text, normalize_embeddings=True)
                return emb.tolist()
            except Exception as e:
                logger.error(f"Error during SentenceTransformer inference: {e}")

        return _fallback_deterministic_embed(text, dim=settings.EMBEDDING_DIM)

    @staticmethod
    def build_product_document(product_dict: dict) -> str:
        """
        Convert structured product information into a clean searchable text document for RAG.
        NOTE: Excludes live inventory count to prevent stale stock representation in embeddings.
        """
        name = product_dict.get("name", "")
        category = product_dict.get("category", "")
        sub_category = product_dict.get("sub_category", "")
        price = product_dict.get("price", "")
        fabric = product_dict.get("fabric", "")
        sizes = ", ".join(product_dict.get("sizes", [])) if isinstance(product_dict.get("sizes"), list) else ""
        colors = ", ".join(product_dict.get("colors", [])) if isinstance(product_dict.get("colors"), list) else ""
        occasions = ", ".join(product_dict.get("occasions", [])) if isinstance(product_dict.get("occasions"), list) else ""
        description = product_dict.get("description", "")
        details = " ".join(product_dict.get("details", [])) if isinstance(product_dict.get("details"), list) else ""

        doc = (
            f"Product Name: {name}\n"
            f"Category: {category} {sub_category}\n"
            f"Price: ₹{price}\n"
            f"Fabric: {fabric}\n"
            f"Sizes Available: {sizes}\n"
            f"Colors: {colors}\n"
            f"Occasions: {occasions}\n"
            f"Description: {description}\n"
            f"Details: {details}"
        )
        return doc.strip()


embedding_service = EmbeddingService()
