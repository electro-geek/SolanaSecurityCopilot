# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SolShield AI** — An AI-powered Solana smart contract security auditing platform. Users upload a ZIP of an Anchor/Rust project or provide a GitHub URL; the backend runs static analysis and Gemini AI explains each vulnerability.

## Running Locally (without Docker)

**Backend:**
```bash
cd backend
source venv/bin/activate
cp .env.example .env  # then fill in values
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local  # then fill in values
npm install
npm run dev
```

**With Docker:**
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend API docs: http://localhost:8000/docs
```

## Lint & Type Checks

```bash
# Frontend lint
cd frontend && npm run lint

# Frontend type check (no dedicated script; use tsc)
cd frontend && npx tsc --noEmit

# Backend has no linter configured; run manually if needed
cd backend && source venv/bin/activate && python -m py_compile main.py
```

## Environment Variables

**Backend (`backend/.env`):**
- `GEMINI_API_KEY` — Google Gemini API key (model: `gemini-2.5-flash`)
- `DATABASE_URL` — PostgreSQL connection string
- `FIREBASE_SERVICE_ACCOUNT_PATH` — path to `firebase-service-account.json`
- `ALLOWED_ORIGINS` — comma-separated CORS origins (has safe defaults if unset)

**Frontend (`frontend/.env.local`):**
- `NEXT_PUBLIC_API_URL` — backend URL (default `http://localhost:8000`)
- `NEXT_PUBLIC_FIREBASE_*` — Firebase project config from Firebase Console

## Architecture

### Backend (FastAPI, Python 3.10)

```
backend/
  main.py              # App entrypoint — CORS, route registration, /health, /me
  auth.py              # Firebase token verification → upserts user in PostgreSQL
  database.py          # SQLAlchemy engine + SessionLocal
  models.py            # SQLAlchemy models: solshield_users, solshield_scans
  routes/
    scan.py            # POST /scan (ZIP upload), POST /analyze-finding (on-demand AI)
    github.py          # POST /scan-github (GitHub repo clone + scan)
    chat.py            # POST /ai-chat (streaming + non-streaming AI chat)
    history.py         # GET /history (user scan history)
  scanner/
    parser.py          # RustParser — regex-based extraction of security constructs
    analyzer.py        # VulnerabilityAnalyzer — orchestrates parser + rules
    findings.py        # Finding, ScanResult dataclasses
    rules/             # 7 rule modules, each extending BaseRule
      __init__.py      # ALL_RULES registry
      base_rule.py     # Abstract BaseRule with check(parsed) → List[Finding]
      signer_validation.py, unsafe_unwrap.py, account_ownership.py,
      insecure_cpi.py, pda_validation.py, arithmetic_overflow.py,
      missing_authority.py
  services/
    ai_service.py      # AIService singleton — wraps Gemini for explain + chat
```

**Key design decisions:**
- The parser is **regex-based**, not tree-sitter (despite README mention). `RustParser.parse_file()` returns a dict with `constructs`, `features_by_line`, and file-level boolean flags.
- AI enrichment is **on-demand**: `/scan` returns findings without AI; the frontend calls `/analyze-finding` per finding when the user clicks "Analyze."
- Authentication is **optional**: `get_current_user` returns `None` (not an exception) for unauthenticated requests. Scan results are stored only when a user is logged in.
- DB session lifetime is managed manually (not via `Depends(get_db)`) in auth and scan routes to avoid session-after-response issues.
- DB table names are prefixed `solshield_` to avoid conflicts with hosting platform reserved tables.

### Frontend (Next.js 16.2.6, React 19)

```
frontend/
  app/
    layout.tsx         # Root layout — global styles, AuthContext provider
    page.tsx           # Landing page (marketing)
    globals.css        # Global CSS — dark theme, glass-card, badge, btn-* classes
  components/
    Navbar.tsx         # Top nav with auth state
    DropZone.tsx       # ZIP drag-and-drop upload (react-dropzone)
    CodeEditor.tsx     # Monaco editor with vulnerable line highlighting
    FindingCard.tsx    # Summary card per vulnerability finding
    FindingDetail.tsx  # Expanded finding view with AI explanation
  context/
    AuthContext.tsx    # Firebase auth state — exposes user + token
  lib/
    api.ts             # Axios instance + typed API functions (scanZip, scanGitHub, streamChat, analyzeFinding)
    firebase.ts        # Firebase app initialization
```

**Key details:**
- Auth token is stored in `localStorage` under `solshield_token` and attached to every API request via an axios interceptor.
- The frontend uses **Next.js 16.2.6** (not 15 as README states) — before using App Router APIs, check `node_modules/next/dist/docs/` for breaking changes per the `AGENTS.md` warning.
- Styling uses inline styles + global CSS classes (`glass-card`, `btn-primary`, `btn-secondary`, `badge-*`). Tailwind v4 is configured but minimal component-level Tailwind is used; prefer the existing inline-style pattern.

### Adding a New Vulnerability Rule

1. Create `backend/scanner/rules/my_rule.py` extending `BaseRule`
2. Implement `check(self, parsed: dict) -> List[Finding]` using `parsed["features_by_line"]`, `parsed["lines"]`, and file-level flags
3. Register it in `backend/scanner/rules/__init__.py` → `ALL_RULES`
4. Add the rule ID and name to the landing page table in `frontend/app/page.tsx` if it's user-facing
