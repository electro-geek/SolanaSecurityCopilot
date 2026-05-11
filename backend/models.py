from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# Renaming tables to avoid conflicts with built-in Nile/Vercel tables
class User(Base):
    __tablename__ = "solshield_users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    scans = relationship("Scan", back_populates="owner")

class Scan(Base):
    __tablename__ = "solshield_scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("solshield_users.id"))
    source_name = Column(String)
    source_type = Column(String) 
    findings_summary = Column(JSON) 
    full_results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="scans")
