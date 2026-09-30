from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.security.deps import get_optional_user
from app.services.rag_service import rag_service

router = APIRouter(prefix="/ai", tags=["Vasudha AI Stylist"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_vasudha_ai(
    chat_in: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """
    POST /api/ai/chat
    Local RAG Shopping Assistant:
    - Zero External API Key
    - Hybrid Search (Local Embedding + Keyword + Filter)
    - Live Inventory Verification
    - Strict Luxury Fashion System Prompt
    - Prompt Injection Defenses
    """
    user_id = user.user_id if user else None

    response = await rag_service.process_chat(
        db=db,
        message=chat_in.message,
        session_id=chat_in.session_id,
        conversation_history=chat_in.conversation_history,
        user_id=user_id
    )

    return response


@router.get("/sessions/{session_id}")
def get_session_history(
    session_id: str,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """Retrieve chat history for a session."""
    session_obj = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session_obj:
        return {"session_id": session_id, "messages": []}

    # Ownership check if session is tied to a user
    if session_obj.user_id and user and session_obj.user_id != user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this chat session."
        )

    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id
    ).order_by(ChatMessage.created_at.asc()).all()

    return {
        "session_id": session_id,
        "messages": [
            {
                "id": m.id,
                "sender": m.sender,
                "text": m.message,
                "products": m.products_data,
                "created_at": m.created_at
            }
            for m in messages
        ]
    }
