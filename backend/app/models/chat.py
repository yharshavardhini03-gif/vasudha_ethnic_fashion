from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey
from app.database import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(60), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(60), primary_key=True, index=True)
    session_id = Column(String(60), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(10), nullable=False)  # "user" or "ai"
    message = Column(Text, nullable=False)
    products_data = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
