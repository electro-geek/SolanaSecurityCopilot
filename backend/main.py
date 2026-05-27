import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import engine, Base
from routes import scan, github, chat, history
from auth import get_current_user
from models import User

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SolShield AI Backend")

def _parse_allowed_origins(value: str | None) -> list[str]:
    if not value:
        return []
    return [o.strip().rstrip("/") for o in value.split(",") if o.strip()]


# CORS configuration
#
# IMPORTANT:
# - Browsers block HTTPS pages calling plain HTTP (mixed content) before CORS even runs.
# - For CORS itself, prefer an explicit allowlist in production.
allowed_origins = _parse_allowed_origins(os.getenv("ALLOWED_ORIGINS"))
if not allowed_origins:
    # Safe defaults for local dev + the two known production frontends.
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://solana-security-copilot.vercel.app",
        "https://solshield.mritunjay.live",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Allow Vercel preview deployments if you ever use them.
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(scan.router)
app.include_router(github.router)
app.include_router(chat.router)
app.include_router(history.router)

# ── Decoy trap: common paths abused by credential-harvesting bots ──────────
# Return a convincing 200 with fake data so the bot thinks it found nothing
# useful, while we log the offending IP for monitoring.
_HONEYPOT_PATHS = {
    "/.env",
    "/.env.local",
    "/.env.production",
    "/.env.backup",
    "/config.php",
    "/wp-config.php",
    "/config.yaml",
    "/config.yml",
    "/secrets.json",
    "/.git/config",
}

@app.middleware("http")
async def block_probe_paths(request: Request, call_next):
    if request.url.path in _HONEYPOT_PATHS:
        # Log the probe so you can track/block repeat offenders
        import logging
        logging.getLogger("solshield.security").warning(
            "Probe attempt: %s %s from %s",
            request.method,
            request.url.path,
            request.client.host if request.client else "unknown",
        )
        # Return empty 404 — don't hint that anything interesting is here
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
    return await call_next(request)

@app.get("/")
def root():
    """API root — confirms the service is alive."""
    return {"service": "SolShield AI", "docs": "/docs", "health": "/health"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/me")
def get_me(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture
    }
