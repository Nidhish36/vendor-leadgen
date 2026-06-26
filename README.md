# Vendor Lead-Gen Portal

An internal B2B lead generation portal that finds vendor businesses to sell our software to.

## What it does
- Search for businesses by keyword + location using Google Places API
- Saves results to PostgreSQL database
- Caches searches in Redis to avoid repeat API calls
- Verifies vendor data by scraping their official websites (Phase 2)

## Tech Stack
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL
- **Cache:** Redis
- **External API:** Google Places API (New)

## Project Status
-  Phase 1 — Core API + Places integration + DB + Cache
-  Phase 2 — Web scraping verification layer (in progress)
-  Phase 3 — Lead management UI
-  Phase 4 — JS-site fallback scraping
-  Phase 5 — Confidence scoring + technographic signals
-  Phase 6 — Lead scoring + CRM integration

## Project Structure
```
vendor-leadgen/
├── docker-compose.yml       # Postgres + Redis containers
├── .env.example             # Environment variable template
├── .gitignore
└── backend/
    ├── requirements.txt
    └── app/
        ├── main.py              # FastAPI app entry point
        ├── config.py            # Loads env variables
        ├── db.py                # Database connection
        ├── models.py            # DB table definitions
        ├── schemas.py           # Request/response shapes
        ├── routers/
        │   └── search.py        # POST /search/ endpoint
        └── services/
            ├── places_provider.py         # Abstract interface
            ├── google_places_provider.py  # Google Places API
            └── cache.py                   # Redis caching
```