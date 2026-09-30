import re
from typing import Dict, Any, Optional

from app.security.domain_guard import (
    INJECTION_PATTERNS,
    OFF_TOPIC_PATTERNS,
    STORE_POLICY_PATTERNS,
    ORDER_QUERY_PATTERNS,
    SHOPPING_ENTITIES,
    OFF_TOPIC_FALLBACK_TEXT,
    SECURITY_REFUSAL_TEXT,
    IntentType,
    classify_user_intent
)


def detect_prompt_injection(text: str) -> bool:
    """Check if the user prompt attempts injection or unauthorized prompt extraction."""
    lower = text.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            return True
    return False


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """Sanitize user input to prevent XSS, oversized queries, and unwanted controls."""
    if not text:
        return ""
    # Truncate
    cleaned = text[:max_length].strip()
    # Strip null bytes and non-printable control characters (except newline, tab)
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", cleaned)
    return cleaned


def extract_query_constraints(query: str) -> Dict[str, Any]:
    """
    Extract structured styling constraints from natural language query:
    - Budget / Max Price / Min Price (e.g., 'under 2500', 'below ₹3000', 'between 2000 and 4000')
    - Size (e.g., 'size M', 'in S', 'XL', 'Free Size')
    - Category (e.g., 'saree', 'anarkali', 'lehenga', 'kurti', 'dress', 'half saree')
    - Occasion (e.g., 'wedding', 'sangeet', 'reception', 'diwali', 'festive')
    - Color (e.g., 'green', 'pink', 'red', 'gold', 'blue', 'orange')
    """
    lower = query.lower()
    constraints = {
        "min_price": None,
        "max_price": None,
        "size": None,
        "category": None,
        "occasion": None,
        "color": None,
        "in_stock_only": True
    }

    # 1. Price Range extraction ("between 2000 and 4000", "2000 to 4000")
    range_match = re.search(r"(?:between|from)?\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)\s*(?:to|and|-)\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)", lower)
    if range_match:
        try:
            p1 = int(range_match.group(1).replace(",", ""))
            p2 = int(range_match.group(2).replace(",", ""))
            constraints["min_price"] = min(p1, p2)
            constraints["max_price"] = max(p1, p2)
        except ValueError:
            pass

    # 2. Max Budget extraction ("under 2500", "below ₹3000", "less than 2000", "within 3000", "around 2000")
    if constraints["max_price"] is None:
        price_match = re.search(r"(?:under|below|less\s+than|within|around|budget\s*of|upto|up\s+to)\s*(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)", lower)
        if price_match:
            try:
                constraints["max_price"] = int(price_match.group(1).replace(",", ""))
            except ValueError:
                pass

    # 3. Size extraction
    size_match = re.search(r"\b(?:in\s+|size\s+|size:\s*)?(xs|s|m|l|xl|xxl|free\s*size)\b", lower)
    if size_match:
        matched_s = size_match.group(1).upper().replace(" ", "")
        if matched_s in ["XS", "S", "M", "L", "XL", "XXL", "FREESIZE"]:
            constraints["size"] = "Free Size" if matched_s == "FREESIZE" else matched_s

    # 4. Category extraction
    if "half saree" in lower or "halfsaree" in lower:
        constraints["category"] = "Half Sarees"
    elif "saree" in lower or "sari" in lower:
        constraints["category"] = "Sarees"
    elif "lehenga" in lower or "choli" in lower:
        constraints["category"] = "Lehengas"
    elif "churidar" in lower or "kurti" in lower or "kurta" in lower or "tunic" in lower:
        constraints["category"] = "Kurtis"
    elif "anarkali" in lower or "dress" in lower or "gown" in lower or "western" in lower:
        constraints["category"] = "Dresses"

    # 5. Occasion extraction
    occasions = ["wedding", "sangeet", "mehendi", "haldi", "reception", "festive", "festival", "puja", "pooja", "bridal", "party", "valentine", "casual", "anniversary", "diwali", "eid"]
    for occ in occasions:
        if occ in lower:
            constraints["occasion"] = "festive" if occ == "festival" else occ
            break

    # 6. Color extraction
    colors = ["green", "pink", "red", "gold", "blue", "orange", "lavender", "coral", "rust", "crimson", "sky blue", "mint", "ivory", "olive", "maroon", "emerald", "gulabi", "yellow", "purple", "black", "white", "peach"]
    for col in colors:
        if col in lower:
            constraints["color"] = col
            break

    return constraints
