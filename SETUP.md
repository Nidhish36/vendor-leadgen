# Setup Guide

Follow these steps exactly to get the project running locally.

## Prerequisites
- Python 3.13 (download from python.org/downloads)
- Docker Desktop (download from docker.com/products/docker-desktop)
- VS Code (recommended)
- Git

## Step 1: Clone the repo
```bash
git clone https://github.com/YOURUSERNAME/vendor-leadgen.git
cd vendor-leadgen
```

## Step 2: Set up environment variables
Copy the example env file and fill in the values:
```bash
cp .env.example .env
```

Open `.env` and fill in:
- `GOOGLE_PLACES_API_KEY` — get this from Google Cloud Console (ask the team lead)
- Leave DATABASE_URL and REDIS_URL as-is for local development

## Step 3: Start Docker (Postgres + Redis)
Make sure Docker Desktop is open and running, then:
```bash
docker compose up -d
```

Verify both containers are running:
```bash
docker ps
```
You should see `vendor_leadgen_db` and `vendor_leadgen_redis` both showing "Up".

## Step 4: Set up Python environment
```bash
cd backend
py -3.13 -m venv venv
```

Activate it:
- **Windows:** `venv\Scripts\activate`
- **Mac/Linux:** `source venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

## Step 5: Run the server
```bash
uvicorn app.main:app --reload
```

Server runs at: http://127.0.0.1:8000

## Step 6: Test it
Open http://localhost:8000/docs in your browser.

Use `POST /search/` with:
```json
{
  "keyword": "restaurants",
  "location": "Bengaluru"
}
```

You should get a list of vendors back.

## Daily workflow
Every time you start working:
1. Open Docker Desktop (wait for green "Engine running")
2. `docker compose up -d` (from project root)
3. `cd backend` → activate venv → `uvicorn app.main:app --reload`

## Stopping everything
```bash
docker compose down   # stops Postgres + Redis
# Ctrl+C in the uvicorn terminal to stop the server
```

## Common Issues

**`ModuleNotFoundError`** — venv not activated. Run `venv\Scripts\activate` first.

**`500 Internal Server Error` on /search/** — check your `.env` file has the correct `GOOGLE_PLACES_API_KEY` with no spaces or quotes.

**`Connection refused` on DB** — Docker isn't running. Open Docker Desktop and run `docker compose up -d`.

**psycopg2 install fails** — make sure you're using Python 3.13, not 3.14.