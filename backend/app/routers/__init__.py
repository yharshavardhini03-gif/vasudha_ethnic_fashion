from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.orders import router as orders_router
from app.routers.ai import router as ai_router
from app.routers.health import router as health_router

__all__ = [
    "auth_router",
    "products_router",
    "orders_router",
    "ai_router",
    "health_router"
]
