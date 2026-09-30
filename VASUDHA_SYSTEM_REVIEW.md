# VasudhaEthnic — System Architecture & Implementation Review

**Platform:** VasudhaEthnic Luxury Indian Fashion Ecommerce  
**Backend Framework:** FastAPI (Python 3.13) + SQLAlchemy 2.0 + Pydantic v2  
**Database:** PostgreSQL 16+ with pgvector (Vector Search Extension)  
**Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons  
**AI Subsystem:** Local Zero-API-Key RAG (SentenceTransformer BAAI/bge-small-en-v1.5 + Local Ollama LLM)  
**Review Date:** September 2026  

---

## Executive Summary

VasudhaEthnic is a full-stack, role-based luxury Indian ethnic fashion ecommerce application. The platform incorporates high-performance transactional inventory handling, server-authoritative stock deduction with row-level locks, role-based JWT security, and a local, privacy-first Retrieval-Augmented Generation (RAG) AI shopping assistant that operates with zero external cloud API keys.

---

## 1. System Architecture

`
┌─────────────────────────────────────────────────────────┐
│              React 18 Frontend (Vite)                   │
│   • Storefront & Collections    • Luxury AI Concierge   │
│   • Cart & Live Checkout        • Seller Admin Suite    │
└────────────────────────────┬────────────────────────────┘
                             │  HTTP / JSON + JWT Bearer
                             ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend (Port 8000)               │
│   • /api/auth    • /api/products   • /api/orders        │
│   • /api/ai      • /health         • /uploads           │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   PostgreSQL Database    │  │     Local RAG Pipeline   │
│ • pgvector 384-dim index │  │ • SentenceTransformer    │
│ • Row-level Locks        │  │ • Ollama (qwen2.5 / llama)│
│ • Full Cascade Relations │  │ • Real-time DB Stock Sync│
└──────────────────────────┘  └──────────────────────────┘
`

---

## 2. Security & Role-Based Access Control

### User Roles
* **Customer (ole=customer)**:
  * Can register, log in, browse products, filter by fabric/occasion/price, converse with the local Vasudha AI shopping assistant, manage wishlist and cart, and place orders with server-authoritative stock deduction.
* **Seller (ole=seller)**:
  * Access to the protected Seller Dashboard, CRUD product management, size/color variant matrix stock adjustments, image uploads, and customer order management.

### Security Defenses
* **Password Hashing**: Bcrypt with auto-generated salts.
* **Authentication**: Stateless HMAC-SHA256 JWT tokens with configurable expiration (ACCESS_TOKEN_EXPIRE_MINUTES).
* **Prompt Injection Defense**: Sanitizer regex filtering detects and neutralizes prompt override patterns before RAG execution.
* **Rate Limiting**: Integrated SlowAPI rate limiting on /api/ai/chat (20 req/min) to prevent CPU starvation on local embedding runs.
* **File Upload Guardrails**: Strict MIME type validation (JPEG, PNG, WEBP), magic byte verification, 5MB file size limit, and UUID-based filename sanitization.
* **Security Headers**: Standard OWASP headers injected across all responses:
  * X-Content-Type-Options: nosniff
  * X-Frame-Options: DENY
  * X-XSS-Protection: 1; mode=block

---

## 3. Database Schema & Data Integrity

### Key Tables
1. **users**: Customer & seller accounts with hashed passwords and role flags.
2. **products**: Base product catalog (title, slug, price, original_price, category, fabric, occasions, description, images, 384-dimensional vector embedding).
3. **product_variants**: Size and color SKU inventory matrix with stock counters.
4. **orders**: Transactional orders with customer references, JSON line items, total amount, shipping details, and status.
5. **chat_sessions & chat_messages**: Persistent conversational history for the Vasudha AI assistant.
6. **udit_logs**: System audit trail capturing sensitive administrative actions.

### Concurrency & Overselling Prevention
Order creation utilizes SQLAlchemy with_for_update() row-level locks on ProductVariant rows within an atomic database transaction. If requested quantity exceeds available stock, the transaction immediately rolls back with an HTTP 400 Out of Stock error.

---

## 4. Zero-External-API-Key Local RAG Architecture

* **Local Embeddings**: Runs locally on CPU via SentenceTransformer('BAAI/bge-small-en-v1.5') with deterministic vector fallback.
* **Local LLM**: Connects to your local Ollama instance (http://localhost:11434).
* **Live Stock Validation**: Product embeddings only encode static descriptive attributes. Dynamic variant inventory is queried directly from PostgreSQL during RAG retrieval.

---

## 5. Verification & Automated Test Suite

A comprehensive test suite of 17 test modules verifies critical system paths:
* **Authentication**: 	est_register_customer, 	est_login_success, 	est_login_invalid_password, 	est_get_me_authenticated, 	est_customer_cannot_access_seller_endpoint.
* **Inventory & Orders**: 	est_order_inventory_deduction_success, 	est_order_out_of_stock_rejected.
* **Products**: 	est_seller_create_product, 	est_list_products_public, 	est_seller_update_variant_stock.
* **RAG & AI**: 	est_prompt_injection_detection, 	est_constraint_extraction, 	est_ai_chat_endpoint_structure, 	est_ai_chat_prompt_injection_safety.
* **Security & Health**: 	est_health_check_endpoint, 	est_security_headers_present, 	est_upload_invalid_mime_rejected.

**Execution Command:** pytest backend/tests/ -v  
**Result:** 17 passed, 100% success rate.

---
*VasudhaEthnic Architecture Review — September 2026.*
