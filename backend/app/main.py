import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import engine, Base
from app.initial_data import init_db_data
from app.routers import (
    auth_router,
    products_router,
    orders_router,
    ai_router,
    health_router
)

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vasudhaethnic")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application Startup and Teardown Lifecycle."""
    logger.info(f"✨ Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    logger.info(f"✦ Local AI Model: {settings.OLLAMA_MODEL} | Embedding Model: {settings.EMBEDDING_MODEL}")
    try:
        init_db_data()
        logger.info("✓ Database initialized & initial catalog verified.")
    except Exception as e:
        logger.error(f"Startup initialization notice: {e}")
    yield
    logger.info("Shutting down VasudhaEthnic API.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Luxury Indian Ethnic Fashion Ecommerce Platform with Local Zero-API-Key RAG AI Stylist",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limit exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
origins = settings.ALLOWED_ORIGINS
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Mount static uploads directory for local product images
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(health_router, prefix="")
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(products_router, prefix=settings.API_PREFIX)
app.include_router(orders_router, prefix=settings.API_PREFIX)
app.include_router(ai_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "message": "Welcome to VasudhaEthnic Luxury Fashion API",
        "docs": "/docs",
        "health": "/health",
        "ai_stylist": f"{settings.API_PREFIX}/ai/chat"
    }
