"""
routes/github.py — GitHub repository scan endpoint
"""

import os
import tempfile
import shutil
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from scanner.analyzer import VulnerabilityAnalyzer
from services.ai_service import ai_service
from database import SessionLocal # Import directly
from auth import get_current_user
from models import User, Scan

router = APIRouter()
analyzer = VulnerabilityAnalyzer()


class GitHubScanRequest(BaseModel):
    url: str


@router.post("/scan-github")
async def scan_github(
    request: GitHubScanRequest,
    user: User = Depends(get_current_user)
):
    """
    Clone a public GitHub repository and scan it for Solana vulnerabilities.
    Saves to history if user is authenticated.
    """
    repo_url = request.url.strip()

    if not repo_url.startswith("https://github.com/"):
        raise HTTPException(
            status_code=400,
            detail="Only public GitHub repository URLs are supported (https://github.com/...)."
        )

    parts = repo_url.rstrip("/").split("/")
    repo_name = "/".join(parts[-2:]) if len(parts) >= 2 else repo_url

    workspace = tempfile.mkdtemp(prefix="solshield_gh_")

    try:
        import git
        clone_dir = os.path.join(workspace, "repo")

        # Clone (Takes time)
        git.Repo.clone_from(
            repo_url,
            clone_dir,
            depth=1,
            multi_options=["--single-branch"]
        )

        # Run scanner (Takes time)
        result = analyzer.analyze_directory(
            clone_dir,
            source="github",
            source_name=repo_name
        )

        if result.rust_files_found == 0:
            raise HTTPException(
                status_code=422,
                detail="No Rust (.rs) files found in this repository. Is this a Solana project?"
            )

        # Enrich top findings with AI (Takes time)
        result_dict = result.to_dict()
        enriched_findings = []
        for i, finding in enumerate(result_dict["findings"]):
            if i < 10 and ai_service.enabled:
                enriched = ai_service.explain_vulnerability(finding)
                enriched_findings.append(enriched)
            else:
                enriched_findings.append(finding)
        result_dict["findings"] = enriched_findings

        # Save to database ONLY at the end (Fast)
        if user:
            db = SessionLocal()
            try:
                new_scan = Scan(
                    scan_id=result_dict["scan_id"],
                    user_id=user.id,
                    source_name=repo_name,
                    source_type="github",
                    findings_summary=result_dict["summary"],
                    full_results=result_dict
                )
                db.add(new_scan)
                db.commit()
            finally:
                db.close()

        return JSONResponse(content=result_dict)

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "Repository not found" in error_msg or "authentication" in error_msg.lower():
            raise HTTPException(status_code=404, detail="Repository not found or is private.")
        raise HTTPException(status_code=500, detail=f"GitHub scan failed: {error_msg}")
    finally:
        shutil.rmtree(workspace, ignore_errors=True)
