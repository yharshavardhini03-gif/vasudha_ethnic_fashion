import logging
import httpx
from typing import Optional, Dict, Any, List
from app.config import settings

logger = logging.getLogger(__name__)


class OllamaService:
    @staticmethod
    async def is_available() -> bool:
        """Check if local Ollama server is responding."""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    @staticmethod
    async def generate_response(
        system_prompt: str,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        timeout_seconds: float = 20.0
    ) -> Optional[str]:
        """
        Send RAG contextual prompt to locally running Ollama model.
        Returns the generated text response, or None if Ollama is unreachable.
        """
        messages = [{"role": "system", "content": system_prompt}]

        if conversation_history:
            for turn in conversation_history[-6:]:  # Limit history to prevent context overflow
                role = "user" if turn.get("sender") == "user" or turn.get("role") == "user" else "assistant"
                content = turn.get("text") or turn.get("content") or turn.get("message") or ""
                if content:
                    messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": user_message})

        payload = {
            "model": settings.OLLAMA_MODEL,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "top_p": 0.9,
                "num_predict": 300
            }
        }

        try:
            async with httpx.AsyncClient(timeout=timeout_seconds) as client:
                response = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/chat",
                    json=payload
                )
                if response.status_code == 200:
                    data = response.json()
                    answer = data.get("message", {}).get("content", "").strip()
                    if answer:
                        return answer
                else:
                    logger.warning(f"Ollama API returned non-200 code: {response.status_code} - {response.text}")
        except httpx.ConnectError:
            logger.info("Ollama is not running locally. Using local stylist engine.")
        except httpx.TimeoutException:
            logger.warning("Ollama inference timed out. Using local stylist engine.")
        except Exception as e:
            logger.warning(f"Ollama local invocation notice: {e}")

        return None


ollama_service = OllamaService()
