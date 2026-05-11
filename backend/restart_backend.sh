#!/bin/bash
cd /home/mritunjay/Desktop/SolanaSecurityCopilot/backend
source venv/bin/activate
pkill -f "uvicorn main:app" || true
nohup python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > uvicorn.log 2>&1 &
echo "Backend started in background"
