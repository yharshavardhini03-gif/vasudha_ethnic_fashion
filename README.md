# 👑 VasudhaEthnic — Full-Stack Luxury Indian Fashion Ecommerce with Local Zero-API-Key RAG AI

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![pgvector](https://img.shields.io/badge/pgvector-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?logo=ollama&logoColor=white)](https://ollama.ai/)
[![Zero API Keys](https://img.shields.io/badge/External_AI_API_Keys-ZERO-success)]()

**VasudhaEthnic** is a high-end, luxury Indian ethnic fashion ecommerce platform equipped with a **local, zero-external-API-key RAG AI shopping assistant**.

---

## 🏛️ System Architecture

```
                    VASUDHAETHNIC
                           │
             ┌─────────────┴─────────────┐
             │                           │
          CUSTOMER                    SELLER
             │                           │
        Storefront                  Dashboard
             │                           │
        Vasudha AI                  Products
             │                      Inventory
             │                      Orders
             │                           │
             └─────────────┬─────────────┘
                           │
                    FastAPI (:8000)
                           │
             ┌─────────────┴─────────────┐
             │                           │
        PostgreSQL                   RAG Engine
             │                           │
        Live Inventory             Local Embeddings (BGE-small)
        Products                    pgvector (Vector Search)
        Orders                           │
        Users                       Hybrid Retriever
             │                           │
             └─────────────┬─────────────┘
                           │
                     Ollama (:11434)
                           │
                   Local Open-Source LLM (llama3.2)
                           │
                     Vasudha AI Response
```

### Key Principles:
1. **Zero External AI API Keys**: Completely self-contained using **Ollama** (`llama3.2`, `qwen2.5`, or `gemma3`) on your local machine and **local sentence-transformers** on CPU.
2. **Live Inventory Verification**: Product embeddings represent stable design attributes (fabric, silhouette, occasions). Live variant stock is queried dynamically from PostgreSQL during retrieval to guarantee **zero hallucination of stock**.
3. **Prompt Injection Defense**: Sanitizes all customer inputs, extracts structured filters (budget `<= ₹3000`, size `M`, category `Dresses`), and enforces a strict royal stylist persona.
4. **Graceful Fallback**: If Ollama is offline or starting up, the built-in deterministic stylist engine takes over so the storefront, cart, checkout, and seller dashboard never crash.

---

## ⚡ Quick Start & Local Setup

### Step 1: Install Ollama & Pull Local Model
Download Ollama from [ollama.ai](https://ollama.ai/) (macOS, Windows, or Linux).
```bash
# Start Ollama service
ollama serve

# Pull preferred local open-source model
ollama pull llama3.2
# or
ollama pull qwen2.5
```

### Step 2: Database Setup (PostgreSQL with pgvector)
```sql
-- Using local PostgreSQL:
CREATE DATABASE vasudhaethnic;
\c vasudhaethnic;
CREATE EXTENSION IF NOT EXISTS vector;
```
*(Note: If running without PostgreSQL active, the backend automatically provides a standalone zero-config SQLite mode).*

### Step 3: Install Python Backend Dependencies
```bash
# Navigate to project root
cd Vasudhaethnic

# Install backend dependencies
pip install -r backend/requirements.txt
```

### Step 4: Seed Database & Local Vector Embeddings
```bash
python backend/app/initial_data.py
```

### Step 5: Start FastAPI Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Step 6: Start React Frontend
```bash
npm install
npm run dev
```
- Open your browser at: `http://localhost:5173/`

---

## 🐳 Docker Deployment

To launch the complete stack (PostgreSQL + pgvector, FastAPI, React) with a single command:
```bash
docker-compose up --build
```

---

## 🧪 Security & Functional Test Suite

Run the automated test suite covering authentication, authorization boundaries, transactional inventory locks, prompt injection defense, and file upload safety:
```bash
pytest backend/tests/ -v
```

---

## 💎 Demo Workflows

### Scenario 1: Seller Product Creation & Customer RAG Query
1. **Seller Login**: Authenticate at `/seller/login` using your configured single-seller merchant credentials.
2. **Add Product**:
   - Title: `Royal Green Anarkali`
   - Price: `₹2,199`
   - Sizes: `S, M, L, XL`
   - Variants: Size `M` = `5` units
   - Upload image & Publish.
3. **Local Embedding**: Local `BAAI/bge-small-en-v1.5` embedder automatically indexes the product into the vector store.
4. **Customer AI Query**:
   - Customer opens **Vasudha AI** on the storefront.
   - Ask: *"I need an elegant dress for a wedding under ₹2500 in size M"*
   - Vasudha AI retrieves `Royal Green Anarkali`, verifies live stock in size M (5 available), and displays the interactive product card with **View** and **Add to Bag**.

### Demo 2: Dynamic Live Inventory Verification
1. In the **Seller Command Center**, update Size `M` stock from `5` to `0`.
2. Customer asks: *"Is the Royal Green Anarkali available in size M?"*
3. **Live Database Lookup**: RAG pipeline checks the live database rather than stale vector data and responds:
   *"The Royal Green Anarkali is currently out of stock in Size M."*

---

## 🛡️ Security Features
- **Zero API Key Dependency**: Immune to API quota limits, third-party key theft, or external downtime.
- **Transactional Row Locking**: Prevents overselling and race conditions during high-demand flash sales.
- **Strict Role-Based Authorization**: Customer vs. Seller endpoints enforced server-side.
- **Safe File Uploads**: Validates MIME types (JPEG, PNG, WEBP), enforces 5MB limits, and sanitizes filenames.
- **Slowapi Rate Limiting**: Protects local inference against denial-of-service attempts.
