from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
from models import User, Scan

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
def get_scan_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Sign in to view history")
    
    scans = db.query(Scan).filter(Scan.user_id == user.id).order_by(Scan.created_at.desc()).all()
    return scans

@router.get("/{scan_id}")
def get_scan_detail(scan_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(status_code=401, detail="Sign in to view history")
    
    scan = db.query(Scan).filter(Scan.scan_id == scan_id, Scan.user_id == user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return scan.full_results
