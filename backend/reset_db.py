import os
from sqlalchemy import create_engine
from database import Base, SQLALCHEMY_DATABASE_URL
from models import User, Scan

# Create a fresh engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def reset():
    print(f"Connecting to: {SQLALCHEMY_DATABASE_URL.split('@')[-1]}")
    
    # This will create the NEWLY named tables (solshield_users, solshield_scans)
    # and ignore the old ones that were causing conflicts.
    print("Creating new SolShield tables...")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Tables 'solshield_users' and 'solshield_scans' created!")

if __name__ == "__main__":
    reset()
