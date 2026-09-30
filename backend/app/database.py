import logging
import re
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

# Normalize DATABASE_URL for SQLAlchemy compatibility
raw_db_url = settings.DATABASE_URL.strip()
if raw_db_url.startswith("postgres://"):
    raw_db_url = "postgresql://" + raw_db_url[len("postgres://"):]

db_url = raw_db_url
IS_POSTGRES = db_url.startswith("postgresql")


def _redacted_url(url_str: str) -> str:
    """Return URL with password masked for safe logging."""
    return re.sub(r":([^:@]+)@", r":****@", url_str)


try:
    if IS_POSTGRES:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            pool_recycle=300,
            pool_timeout=30,
            connect_args={"connect_timeout": 10}
        )
        # Test connection & enable pgvector extension safely
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            try:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                conn.commit()
                logger.info(f"✓ Connected to PostgreSQL ({_redacted_url(db_url)}) & pgvector extension enabled")
            except Exception as e:
                logger.warning(f"pgvector extension check note: {e}")
    else:
        engine = create_engine(
            db_url,
            connect_args={"check_same_thread": False}
        )
        logger.info(f"Using local database: {_redacted_url(db_url)}")
except Exception as e:
    logger.warning(
        f"PostgreSQL connection to {_redacted_url(db_url)} failed ({e}). "
        f"Falling back to local SQLite database for standalone zero-config execution."
    )
    db_url = "sqlite:///./vasudha_local.db"
    IS_POSTGRES = False
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI Dependency for database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
