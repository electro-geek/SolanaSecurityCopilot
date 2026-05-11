import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import scan, github, chat, history
from auth import get_current_user
from models import User

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SolShield AI Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(scan.router)
app.include_router(github.router)
app.include_router(chat.router)
app.include_router(history.router) # We'll create this next

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
