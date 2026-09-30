from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.services.ollama_service import ollama_service
from app.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Public Health Check Endpoint.
    Returns operational status of the service, database, and local AI runtime.
    Does NOT leak credentials or internal secrets.
    """
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "unreachable"

    ollama_online = await ollama_service.is_available()

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "version": settings.VERSION,
        "database": db_status,
        "local_ai": {
            "runtime": "Ollama (Local)",
            "model": settings.OLLAMA_MODEL,
            "status": "online" if ollama_online else "offline / standby"
        },
        "embedding": {
            "model": settings.EMBEDDING_MODEL,
            "dimension": settings.EMBEDDING_DIM,
            "device": "cpu"
        }
    }
