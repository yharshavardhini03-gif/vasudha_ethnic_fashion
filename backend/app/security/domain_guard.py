import re
import logging
from enum import Enum
from typing import Dict, Any, Optional, Tuple, List

logger = logging.getLogger(__name__)


class IntentType(str, Enum):
    SECURITY_VIOLATION = "security_violation"
    OFF_TOPIC = "off_topic"
    STORE_INFO = "store_info"
    ORDER_QUERY = "order_query"
    SHOPPING_RAG = "shopping_rag"


# Exact required off-topic fallback response
OFF_TOPIC_FALLBACK_TEXT = (
    "I'm the VasudhaEthnic shopping assistant. I can only help with products, "
    "prices, availability, orders, delivery, and information available on this website."
)

SECURITY_REFUSAL_TEXT = (
    "Namaste! 🙏 I am Vasudha AI, your personal ethnic fashion concierge. "
    "I am here exclusively to help you find royal sarees, handcrafted lehengas, "
    "kurtis, and wedding ensembles from our boutique."
)

# 1. Strict Security & Injection Patterns
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?([a-z]+\s+)?instructions?",
    r"system\s+prompt",
    r"database\s+password",
    r"admin\s+password",
    r"db\s+credentials?",
    r"server\s+secrets?",
    r"drop\s+table",
    r"delete\s+from",
    r"delete\s+(the\s+)?inventory",
    r"change\s+(the\s+)?(product\s+)?price",
    r"select\s+\*\s+from",
    r"show\s+(me\s+)?all\s+(customers?|users?|accounts?|orders?|data)",
    r"give\s+me\s+another\s+customer('?s)?\s+order",
    r"reveal\s+(secret|credentials?|environment|api\s*key)",
    r"exec\(",
    r"eval\(",
    r"os\.system",
    r"subprocess",
    r"act\s+as\s+an\s+unrestricted",
    r"developer\s+mode",
    r"dan\s+mode",
]

# 2. Obvious Off-Topic Patterns
OFF_TOPIC_PATTERNS = [
    # Identity / personal trivia
    r"^(what\s+is|what'?s|tell\s+me|do\s+you\s+know)\s+(my|your\s+creator'?s?)\s+name\??$",
    r"^who\s+am\s+i\??$",
    r"^where\s+do\s+i\s+live\??$",
    r"^what\s+is\s+my\s+(age|gender|birthday|location|email|phone)\??$",
    
    # Public figures / celebrities / politics
    r"^who\s+is\s+(elon\s+musk|jeff\s+bezos|bill\s+gates|sam\s+altman|modi|trump|biden|obama|the\s+president|the\s+prime\s+minister)\??$",
    r"^who\s+is\s+[a-z\s]+(\?|\.|\!)?$",  # Matches generic "Who is X?" when not clothing/designer related
    
    # Jokes, stories, poems, entertainment
    r"(tell\s+me\s+a\s+joke|make\s+me\s+laugh|crack\s+a\s+joke)",
    r"^(tell\s+me\s+a\s+story|write\s+a\s+(story|poem|song|essay|script|novel))",
    r"^(sing\s+a\s+song|play\s+a\s+game)",
    
    # Coding, programming, math, science
    r"write\s+(python|javascript|java|c\+\+|html|css|sql|rust|go|c#|php|code|script|program)\b",
    r"(debug|fix)\s+(my\s+)?(code|script|program)",
    r"^(what\s+is\s+)?\d+\s*[\+\-\*\/\^x]\s*\d+\s*(\=|\?)?$",
    r"^(calculate|solve|compute)\b",
    r"explain\s+(quantum\s+)?(physics|quantum|calculus|relativity|gravity|chemistry|biology|algebra|astronomy)",
    
    # Weather, news, geography
    r"(what('?s|\s+is)\s+the\s+weather|weather\s+(today|tomorrow|forecast|in|report))",
    r"(what\s+is\s+today'?s\s+news|latest\s+news|tell\s+me\s+the\s+news|current\s+news|news\s+today)",
    r"^(what\s+is\s+the\s+capital\s+of|where\s+is|distance\s+between)\b",
    
    # General non-shopping topics
    r"(how\s+to\s+cook|recipe\s+for|weight\s+loss|medical\s+advice|symptoms\s+of)",
]

# 3. Store FAQ / Policy Patterns
STORE_POLICY_PATTERNS = {
    "delivery": [
        r"\b(delivery|deliver|shipping|ship|courier|dispatch|timeline|transit|tracking|how\s+long\s+does\s+it\s+take)\b"
    ],
    "returns": [
        r"\b(return|returns|return\s+policy|exchange|exchanges|refund|refunds|money\s+back)\b"
    ],
    "payments": [
        r"\b(payment|payments|payment\s+methods?|cod|cash\s+on\s+delivery|upi|google\s+pay|card|cards|net\s+banking)\b"
    ],
    "contact": [
        r"\b(contact|customer\s+care|customer\s+support|phone\s+number|email\s+address|help\s+desk|boutique\s+address|location)\b"
    ],
    "categories": [
        r"\b(what\s+(products|items|clothes|clothing|categories)\s+do\s+you\s+sell|what\s+do\s+you\s+sell|what\s+categories\s+(are\s+available|do\s+you\s+have))\b"
    ]
}

# 4. Authenticated Order Patterns
ORDER_QUERY_PATTERNS = [
    r"\b(my\s+orders?|where\s+is\s+my\s+order|order\s+status|track\s+(my\s+)?order|my\s+recent\s+(order|purchase)|order\s+details)\b"
]

# 5. Core Fashion / Ethnic Shopping Entities & Keywords
SHOPPING_ENTITIES = {
    "garments": [
        "saree", "sarees", "sari", "saris", "lehenga", "lehengas", "choli", "ghagra",
        "kurti", "kurtis", "kurta", "kurtas", "anarkali", "anarkalis", "dress", "dresses",
        "gown", "gowns", "half saree", "half sarees", "halfsaree", "halfsarees",
        "churidar", "churidars", "dupatta", "dupattas", "blouse", "blouses",
        "ethnic", "ethnic wear", "traditional", "traditional wear", "outfit", "outfits",
        "clothes", "clothing", "wear", "attire", "garment", "garments", "apparel",
        "collection", "catalog", "catalogue", "ensemble", "ensembles", "suit", "suits"
    ],
    "fabrics": [
        "silk", "pure silk", "banarasi", "kanjivaram", "chanderi", "tussar", "cotton",
        "georgette", "crepe", "velvet", "organza", "chiffon", "zari", "zari work",
        "embroidery", "handcrafted", "woven", "handloom", "sequin", "mirror work",
        "gota patti", "brocade", "raw silk", "art silk"
    ],
    "occasions": [
        "wedding", "shaadi", "marriage", "reception", "sangeet", "mehendi", "haldi",
        "puja", "pooja", "diwali", "eid", "navratri", "festive", "festival", "festivals",
        "bridal", "bride", "bridesmaid", "party", "cocktail", "anniversary", "celebration",
        "casual", "festivity", "ceremony", "function"
    ],
    "shopping_actions": [
        "buy", "shop", "purchase", "order", "find", "show", "show me", "recommend",
        "suggest", "looking for", "need", "search", "available", "availability",
        "in stock", "stock", "price", "cost", "rate", "under", "below", "budget",
        "discount", "cheap", "affordable", "size", "sizes", "color", "colors", "colour"
    ]
}


def classify_user_intent(query: str, user_id: Optional[str] = None) -> Tuple[IntentType, Dict[str, Any]]:
    """
    Multi-layered Domain & Intent Classifier for VasudhaEthnic:
    1. Check for prompt injection / security violations.
    2. Check for authenticated order queries.
    3. Check for store policies / FAQs.
    4. Check for obvious off-topic queries.
    5. Check for shopping / styling / product queries.
    6. Default to off-topic if no shopping/store intent is established.
    """
    clean = query.strip()
    lower = clean.lower()

    # 1. Security / Prompt Injection Detection
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            return IntentType.SECURITY_VIOLATION, {"pattern": pattern}

    # 2. Authenticated Customer Order Queries
    for pattern in ORDER_QUERY_PATTERNS:
        if re.search(pattern, lower):
            return IntentType.ORDER_QUERY, {"authenticated": bool(user_id)}

    # 3. Store Policies / FAQs (Delivery, Returns, Payments, Contact, Catalog Overview)
    for topic, patterns in STORE_POLICY_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, lower):
                # Ensure it's not asking to BUY or filter a specific garment
                has_garment_filter = any(g in lower for g in ["saree", "lehenga", "kurti", "anarkali", "half saree"])
                has_price_filter = bool(re.search(r"(under|below|less than)\s*(\d+|₹)", lower))
                if not (has_garment_filter and has_price_filter):
                    return IntentType.STORE_INFO, {"topic": topic}

    # 4. Strict Off-Topic Patterns
    for pattern in OFF_TOPIC_PATTERNS:
        if re.search(pattern, lower):
            return IntentType.OFF_TOPIC, {"reason": "matched_off_topic_pattern"}

    # 5. Ethnic Shopping / Product Recommendation / Availability Checks
    has_garment = any(g in lower for g in SHOPPING_ENTITIES["garments"])
    has_fabric = any(f in lower for f in SHOPPING_ENTITIES["fabrics"])
    has_occasion = any(o in lower for o in SHOPPING_ENTITIES["occasions"])
    has_action = any(a in lower for a in SHOPPING_ENTITIES["shopping_actions"])
    has_price_constraint = bool(re.search(r"(under|below|less than|within|around|budget|price|₹|rs\.?|inr)\s*(\d+[\d,]*)", lower))
    has_size_constraint = bool(re.search(r"\b(size\s+[xs|s|m|l|xl|xxl]|in\s+[s|m|l|xl]|size\s*m|size\s*s|size\s*l|size\s*xl|free\s*size)\b", lower))
    has_color_query = bool(re.search(r"\b(what\s+colors|colors?\s+available|in\s+(red|green|blue|pink|gold|yellow|orange|lavender|maroon|emerald))\b", lower))

    # If query contains any garment, fabric, occasion + shopping action, price constraint, or size constraint
    if (
        has_garment or
        has_fabric or
        has_occasion or
        has_price_constraint or
        has_size_constraint or
        has_color_query or
        (has_action and ("outfit" in lower or "item" in lower or "product" in lower or "collection" in lower or "wear" in lower or "anything" in lower))
    ):
        return IntentType.SHOPPING_RAG, {
            "has_garment": has_garment,
            "has_fabric": has_fabric,
            "has_occasion": has_occasion,
            "has_price_constraint": has_price_constraint,
            "has_size_constraint": has_size_constraint,
            "has_color_query": has_color_query
        }

    # Generic shopping checks like "Do you have this?", "What is the price of this?", "Show me something elegant"
    generic_shopping_phrases = [
        r"\bprice\s+of\b",
        r"\bhow\s+much\s+(is|for|does)\b",
        r"\bdo\s+you\s+have\b",
        r"\bis\s+this\s+available\b",
        r"\bwhat\s+is\s+available\b",
        r"\bshow\s+me\b",
        r"\brecommend\s+something\b",
        r"\bi\s+need\s+something\b",
        r"\blooking\s+for\s+something\b",
        r"\bwhat\s+should\s+i\s+wear\b",
    ]
    for ph in generic_shopping_phrases:
        if re.search(ph, lower):
            return IntentType.SHOPPING_RAG, {"generic_phrase": ph}

    # 6. If no shopping or store policy intent is established, safely classify as OFF_TOPIC
    return IntentType.OFF_TOPIC, {"reason": "no_domain_match"}
