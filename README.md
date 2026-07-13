# Bank Turnover Analyzer

A small project that downloads bank e-statements from Gmail, parses transactions from PDF bank statements, stores them in PostgreSQL, and exposes a FastAPI backend and a React frontend for reporting and visualization.

This README covers setup, common maintenance tasks, and verification/check steps you can use before sharing results publicly.

---

## Features
- Fetch bank e-statements from Gmail (Gmail API)
- Parse transactions from bank PDF statements (pdfplumber-based parser)
- Store transactions in PostgreSQL with optional `owner_email` attribution
- FastAPI backend with endpoints for reports and sync operations
- React + Vite frontend with dashboard, monthly/yearly reports
- Utility scripts for auditing, assigning owners, and deduplication

---

## Tech stack
- Python 3.12 (FastAPI, SQLAlchemy)
- PostgreSQL
- React (Vite)
- Gmail API (google-api-python-client)
- pdf parsing utilities in `backend/app/services`

---

## Prerequisites
- Docker & docker-compose (recommended for running Postgres)
- Python 3.12 and virtualenv
- Node.js & npm (for frontend)

---

## Repo layout (important files)
- backend/: FastAPI backend and scripts
	- `backend/app/api/gmail.py` — Gmail endpoints and sync handlers
	- `backend/app/services/statement_processor.py` — PDF -> text -> parser orchestration
	- `backend/app/services/transaction_parser.py` — transaction parsing logic
	- `backend/app/services/transaction_storage.py` — DB insertion & dedupe logic
	- `backend/app/models/transactions.py` — `transactions` model (has `owner_email` column)
	- `backend/scripts/` — audit, assign, and dedupe scripts (examples: `full_audit.py`, `dedupe_transactions.py`)
- frontend/: React/Vite app

---

## Quickstart (development)
1. Start Postgres (docker-compose):

```bash
docker compose up -d postgres
```

2. Backend: create and activate venv, install deps

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

3. Frontend: install deps

```bash
cd frontend
npm install
```

4. Environment
- Copy or create a `.env` file at `backend/` with at least:
	- `SECRET_KEY` (session middleware key)
	- Google OAuth client credentials (if you plan to use Gmail features) configured in the app's OAuth setup.

5. Start backend (development)

```bash
cd backend
. .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

6. Start frontend (development)

```bash
cd frontend
npm run dev
```

Open the frontend (usually at `http://localhost:5173`) and log in via Google to use the sync features.

---

## Docker Compose (single-command)

For an easy development stack (Postgres + backend + frontend) use Docker Compose. This repository includes `docker-compose.yml` and dev `Dockerfile`s for backend and frontend.

- Build and start everything with one command:

```bash
docker compose up --build
```

- Or run detached:

```bash
docker compose up --build -d
```

- Environment variables you may want to set (can be provided in your shell or an env file):
	- `SECRET_KEY` — backend session secret (defaults in compose for dev)
	- `VITE_API_URL` — frontend -> backend API base (defaults to `http://localhost:8001`)
	- `DATABASE_URL` — backend DB connection (compose sets a value for dev)

- Quick verifications once `docker compose` finishes:
	- API root: `curl http://localhost:8001/`
	- Dashboard summary: `curl http://localhost:8001/dashboard/summary`
	- Frontend dev server: open `http://localhost:5173`

- Useful docker-compose commands:

```bash
# View logs (backend):
docker compose logs -f backend

# Run a shell in the backend container:
docker compose exec backend /bin/sh

# Stop and remove containers:
docker compose down
```

Notes:
- The compose services mount the `backend/` and `frontend/` folders as volumes for hot-reload during development.
- Gmail sync endpoints require a logged-in session (OAuth). Use the browser UI to authenticate before invoking `/gmail/process-all`.

---

## Important endpoints and scripts
- `/gmail/process-all` (GET) — process and import Gmail statements. The server requires a logged-in user (owner attribution).
- `/gmail/clear-processed-range` (POST) — clears processed message flags for the configured date range so messages can be reprocessed.
- Audit & maintenance scripts (found under `backend/scripts`):
	- `full_audit.py` — compares DB totals vs parsed local PDFs, lists skipped files and duplicates
	- `assign_unowned_full_period.py` — assign `owner_email` to unowned rows for the audit period
	- `dedupe_transactions.py` — remove exact-duplicate transaction rows (keeps earliest)
	- `check_reports.py` — quick queries for monthly or owner-specific checks

Use these scripts from the backend folder while your virtualenv and `PYTHONPATH` are set:

```bash
. .venv/bin/activate
PYTHONPATH=. python3 scripts/full_audit.py
```

---
