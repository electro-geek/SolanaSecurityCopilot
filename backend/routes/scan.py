"""
routes/scan.py — ZIP upload scan endpoint
"""

import os
import zipfile
import tempfile
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from scanner.analyzer import VulnerabilityAnalyzer
from services.ai_service import ai_service
from database import SessionLocal # Import directly to control session timing
from auth import get_current_user
from models import User, Scan

router = APIRouter()
analyzer = VulnerabilityAnalyzer()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("/scan")
async def scan_zip(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    """
    Upload a ZIP file containing a Solana/Anchor project.
    Returns vulnerability findings with AI explanations.
    """
    # Validate file type
    if not file.filename or not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files are accepted.")

    # Read file content
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")

    # Create temp workspace
    workspace = tempfile.mkdtemp(prefix="solshield_")
    zip_path = os.path.join(workspace, "upload.zip")

    try:
        # Save ZIP
        with open(zip_path, "wb") as f:
            f.write(content)

        # Extract ZIP
        extract_dir = os.path.join(workspace, "project")
        os.makedirs(extract_dir, exist_ok=True)

        with zipfile.ZipFile(zip_path, "r") as zf:
            for member in zf.namelist():
                member_path = os.path.realpath(os.path.join(extract_dir, member))
                if not member_path.startswith(os.path.realpath(extract_dir)):
                    raise HTTPException(status_code=400, detail="Invalid ZIP: path traversal detected.")
            zf.extractall(extract_dir)

        # Run scanner (This is the long part)
        result = analyzer.analyze_directory(
            extract_dir,
            source="upload",
            source_name=file.filename
        )

        if result.rust_files_found == 0:
            raise HTTPException(
                status_code=422,
                detail="No Rust (.rs) files found in the uploaded project."
            )

        # Enrich findings with AI (Also takes time)
        result_dict = result.to_dict()
        enriched_findings = []
        for i, finding in enumerate(result_dict["findings"]):
            if i < 10 and ai_service.enabled:
                enriched = ai_service.explain_vulnerability(finding)
                enriched_findings.append(enriched)
            else:
                enriched_findings.append(finding)
        result_dict["findings"] = enriched_findings

        # ONLY NOW we open a DB session to save (Fast operation)
        if user:
            db = SessionLocal()
            try:
                new_scan = Scan(
                    scan_id=result_dict["scan_id"],
                    user_id=user.id,
                    source_name=file.filename,
                    source_type="zip",
                    findings_summary=result_dict["summary"],
                    full_results=result_dict
                )
                db.add(new_scan)
                db.commit()
            finally:
                db.close()

        return JSONResponse(content=result_dict)

    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid or corrupted ZIP file.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
    finally:
        shutil.rmtree(workspace, ignore_errors=True)
