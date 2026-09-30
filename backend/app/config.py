import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "VasudhaEthnic Luxury Fashion API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database
    # Default to PostgreSQL, with automatic SQLite fallback for local development if PostgreSQL is not active
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/vasudhaethnic"
    )

    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vasudha_luxury_ethnic_secret_key_2026_super_secure_jwt_token_seed")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Single Authorized Seller Configuration
    INITIAL_SELLER_EMAIL: str = os.getenv("INITIAL_SELLER_EMAIL", "atelier@vasudhaethnic.com")
    INITIAL_SELLER_PASSWORD: str = os.getenv("INITIAL_SELLER_PASSWORD", "VasudhaAtelier2026!Secure")
    INITIAL_SELLER_NAME: str = os.getenv("INITIAL_SELLER_NAME", "Vasudha Atelier Lead")
    INITIAL_SELLER_USER_ID: str = os.getenv("INITIAL_SELLER_USER_ID", "seller")
    INITIAL_SELLER_PHONE: str = os.getenv("INITIAL_SELLER_PHONE", "+91 95228 38485")

    # Local Open-Source AI Configuration (Zero API Keys)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
    EMBEDDING_DIM: int = 384
    TOP_K: int = 6
    MAX_MESSAGE_LENGTH: int = 1000
    MAX_CONVERSATION_HISTORY: int = 10
    RATE_LIMIT_AI_CHAT: str = "20/minute"

    # CORS
    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    # File Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "products")
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_MIME_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
