"""
routes/chat.py — AI Security Chat endpoint
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional

from services.ai_service import ai_service

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    context: Optional[str] = None
    stream: Optional[bool] = False


@router.post("/ai-chat")
async def ai_chat(request: ChatRequest):
    """
    Ask the AI Solana security assistant a question.
    Supports streaming responses.
    """
    if not request.question.strip():
        return JSONResponse(
            status_code=400,
            content={"error": "Question cannot be empty."}
        )

    if request.stream:
        async def generate():
            async for chunk in ai_service.stream_chat(request.question, request.context):
                yield chunk

        return StreamingResponse(
            generate(),
            media_type="text/plain",
            headers={"X-Accel-Buffering": "no"},
        )

    # Non-streaming response
    response = ai_service.chat(request.question, request.context)
    return JSONResponse(content={"response": response})
