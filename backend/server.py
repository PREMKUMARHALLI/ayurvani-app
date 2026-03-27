from __future__ import annotations
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AyurVani API", version="1.0.0")

FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]
SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "session")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "lax").lower()

# fallback for local development
if not ALLOWED_ORIGINS:
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory "DB" for hackathon demo (replace with Mongo in production).
USERS_BY_ID: Dict[str, Dict[str, Any]] = {}
SESSIONS_BY_TOKEN: Dict[str, str] = {}  # token -> user_id


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_session_user(request: Request) -> Optional[Dict[str, Any]]:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        return None
    user_id = SESSIONS_BY_TOKEN.get(token)
    if not user_id:
        return None
    return USERS_BY_ID.get(user_id)


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        SESSION_COOKIE_NAME,
        token,
        httponly=True,
        samesite=SESSION_COOKIE_SAMESITE,
        secure=SESSION_COOKIE_SECURE,
        path="/",
    )


class AuthLanguageUpdate(BaseModel):
    language: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    preferred_language: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ChatMessage(BaseModel):
    message: str
    language: str


class ChatResponse(BaseModel):
    response: str
    timestamp: str
    source: str


class PrakritiSubmitRequest(BaseModel):
    prakriti: Dict[str, Any]


class HealthEntryRequest(BaseModel):
    symptom: str
    severity: int = 5
    additional_notes: Optional[str] = None


def language_response_prefix(language: str) -> str:
    return {
        "en": "Namaste! (AyurVani) ",
        "hi": "नमस्ते! (आयुर्वाणी) ",
        "kn": "ನಮಸ್ಕಾರ! (ಆಯುರ್ವಾಣಿ) ",
        "te": "నమస్కారం! (ఆయుర్వాణి) ",
        "ta": "வணக்கம்! (ஆயுர்வாணி) ",
    }.get(language, "Namaste! (AyurVani) ")


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "AyurVani API - Ayurvedic SLM Backend (demo)", "version": "1.0.0"}


@app.get("/api/")
async def api_root() -> Dict[str, str]:
    return {"message": "AyurVani API - Ayurvedic SLM Backend (demo)", "version": "1.0.0"}


@app.get("/api/auth/me")
async def me(request: Request) -> Any:
    user = get_session_user(request)
    # The frontend treats any thrown error as "logged out", so returning null is fine.
    return user if user else None


@app.post("/api/auth/register")
async def register(req: RegisterRequest, response: Response) -> Any:
    # This demo stores plain text passwords. Do NOT do this in production.
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "_id": user_id,
        "email": req.email,
        "name": req.name,
        "password": req.password,
        "preferred_language": req.preferred_language,
        "created_at": utc_now_iso(),
        "prakriti": None,
        "health_history": [],
    }
    USERS_BY_ID[user_id] = user

    token = str(uuid.uuid4())
    SESSIONS_BY_TOKEN[token] = user_id
    set_session_cookie(response, token)
    # Don't leak password
    user_out = {k: v for k, v in user.items() if k != "password"}
    return user_out


@app.post("/api/auth/login")
async def login(req: LoginRequest, response: Response) -> Any:
    # Find user by email
    user = None
    for u in USERS_BY_ID.values():
        if u["email"] == req.email:
            user = u
            break
    if not user or user.get("password") != req.password:
        response.status_code = 401
        return {"detail": "Invalid credentials"}

    token = str(uuid.uuid4())
    SESSIONS_BY_TOKEN[token] = user["id"]
    set_session_cookie(response, token)
    user_out = {k: v for k, v in user.items() if k != "password"}
    return user_out


@app.post("/api/auth/logout")
async def logout(request: Request, response: Response) -> Dict[str, str]:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if token:
        SESSIONS_BY_TOKEN.pop(token, None)
    response.delete_cookie(SESSION_COOKIE_NAME, path="/")
    return {"ok": "logged out"}


@app.put("/api/auth/language")
async def update_language(req: AuthLanguageUpdate, request: Request) -> Any:
    user = get_session_user(request)
    if not user:
        return {"detail": "Unauthorized"}
    user["preferred_language"] = req.language
    return {"ok": True}


@app.get("/api/chat/status")
async def chat_status() -> Dict[str, Any]:
    # For this demo, we always claim "local" availability.
    return {
        "mode": "local",
        "ollama": {"available": True, "url": "http://localhost:11434"},
        "cloud": {"available": False},
    }


@app.post("/api/chat/message")
async def send_message(msg: ChatMessage, request: Request) -> ChatResponse:
    user = get_session_user(request)
    preferred_lang = msg.language or (user.get("preferred_language") if user else "en")  # type: ignore[union-attr]

    prefix = language_response_prefix(preferred_lang)
    # Keep demo response short and safe.
    response_text = (
        f"{prefix}"
        f"You asked: \"{msg.message}\".\n\n"
        f"Based on Ayurvedic principles, a helpful starting point is:\n"
        f"- Hydration + light, warm meals\n"
        f"- Simple daily routine (dinacharya)\n"
        f"- Gentle yoga/breathing (pranayama)\n\n"
        f"Disclaimer: AI-generated advice is not a substitute for professional medical consultation."
    )

    return ChatResponse(response=response_text, timestamp=utc_now_iso(), source="local-demo")


@app.post("/api/prakriti/submit")
async def prakriti_submit(req: PrakritiSubmitRequest, request: Request) -> Dict[str, Any]:
    user = get_session_user(request)
    if not user:
        return {"detail": "Unauthorized"}
    user["prakriti"] = req.prakriti
    return {"ok": True}


@app.post("/api/health/entry")
async def add_health_entry(req: HealthEntryRequest, request: Request) -> Dict[str, Any]:
    user = get_session_user(request)
    if not user:
        return {"detail": "Unauthorized"}
    entry = {
        "id": str(uuid.uuid4()),
        "symptom": req.symptom,
        "severity": max(1, min(10, int(req.severity))),
        "additional_notes": req.additional_notes,
        "created_at": utc_now_iso(),
    }
    user.setdefault("health_history", []).insert(0, entry)
    return {"ok": True, "entry": entry}


@app.get("/api/health/entries")
async def health_entries(request: Request) -> List[Any]:
    user = get_session_user(request)
    if not user:
        return []
    return user.get("health_history", [])[:50]


@app.get("/api/health/timeline")
async def health_timeline(request: Request) -> List[Any]:
    # For MVP, timeline is the same list.
    return await health_entries(request)

