import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User

# Initialize Firebase Admin
cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "firebase-service-account.json")
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    print(f"WARNING: Firebase service account file not found at {cred_path}. Auth will fail.")

from database import SessionLocal # Import SessionLocal directly

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    db = SessionLocal()
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        name = decoded_token.get("name")
        picture = decoded_token.get("picture")

        # Get or create user in our DB
        user = db.query(User).filter(User.firebase_uid == uid).first()
        if not user:
            user = User(
                firebase_uid=uid,
                email=email,
                name=name,
                picture=picture
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Return a simple dict or detached object to avoid session issues
        # Since we close the session here, the object might become stale.
        # Let's return a simple object or just the ID.
        return user
    except Exception as e:
        print(f"Auth error: {e}")
        return None
    finally:
        db.close()
