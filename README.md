# Vendor Lead-Gen Portal

> An automated B2B lead discovery and website verification engine built for GoPearch with a minimalist industrial UI.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Celery](https://img.shields.io/badge/celery-%23a9cc54.svg?style=for-the-badge&logo=celery&logoColor=ddf4a4)](https://docs.celeryq.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)](https://playwright.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Overview

**Vendor Lead-Gen Portal** is an internal B2B sales enablement platform built for **GoPearch** to streamline commercial prospecting. It queries local business listings via the **Google Places API v1 (New)**, caches search queries in **Redis** for cost efficiency, stores persistent lead records in **PostgreSQL**, and automatically deploys asynchronous **Celery + Playwright** worker nodes to crawl official vendor websites. 

The crawler executes dynamic JavaScript single-page apps (SPAs) to discover authentic contact info (phone numbers, emails, contact sub-pages, and social media handles), standardizes phone numbers using Google's international **libphonenumber** library, and highlights mismatches against Google Maps data.

---

## Features

- **Dynamic Lead Discovery:** Queries business keywords and locations with Google Places API v1.
- **Search Pagination ("Load More"):** Handles `next_page_token` tracking to load additional batches without losing active query filters.
- **24-Hour Query Caching:** In-memory Redis cache prevents duplicate external API hits and reduces billing overhead.
- **Headless Browser Scraping:** Automated Playwright (Chromium) crawls single-page applications (React, Angular, Vue) to extract emails, phone numbers, and sub-pages (`/contact-us`, `/about`).
- **E.164 Phone Normalization:** Cleans and formats phone numbers using Google's `phonenumbers` library to detect discrepancies between public Google listings and actual website contact pages.
- **Asynchronous Task Queue:** Celery background worker manages scraping tasks asynchronously without blocking API or UI response times.
- **Interactive OpenStreetMap (Leaflet):** Real-time geographic mapping of leads with custom glowing dot markers, dark/light theme filters, and smart zoom-locking.
- **Single-Tunnel Reverse Proxy:** Vite dev server reverse proxies `/vendors` and `/search` to FastAPI, enabling full remote access over a single Ngrok tunnel.
- **Nothing Tech Industrial Design:** Dot-grid background, typography matching Space Mono, custom status badges, and class-based Dark/Light theme switching.

---

## Demo

Experience zero-setup remote sharing: run the local Vite proxy and ngrok tunnel to test discovery searches, background scraping tasks, and map coordinates from desktop or mobile browsers.

---

## Screenshots

> *Place your screenshots into a `screenshots/` directory at the project root with the matching filenames:*

### 1. Overview Dashboard
*Displays macro metrics (Total Leads, Verified, Mismatched, Dead Sites) with clickable quick-filter cards.*  
![Dashboard Overview](screenshots/overview.png)  
*(Insert screenshot of the Overview tab with metric cards and node status)*

### 2. Lead Finder & Pagination
*Keyword and location search console with real-time lead results and "Load More" pagination.*  
![Lead Finder](screenshots/search.png)  
*(Insert screenshot of the Lead Finder tab after running a query)*

### 3. Saved Leads & Verification Status
*Detailed lead database showing verification badges (Verified, Mismatch, Dead Site, Unverified) and contact drawer triggers.*  
![Saved Leads](screenshots/leads.png)  
*(Insert screenshot of the Saved Leads table with diverse status badges)*

### 4. Interactive Map View
*OpenStreetMap interface plotting discovered vendor coordinates with glowing pulse pins.*  
![Interactive Map View](screenshots/map.png)  
*(Insert screenshot of the Map View tab focused on plotted lead coordinates)*

---

## Tech Stack

| Domain | Technology / Library | Description |
|---|---|---|
| **Frontend** | React 18 + Vite 6 | Fast SPA build tool and client application |
| | Tailwind CSS | Utility-first styling with Nothing Tech theme & dark mode |
| | Leaflet.js | Open-source interactive map rendering via OpenStreetMap |
| | Lucide React | Minimalist UI icons |
| **Backend API** | FastAPI | High-performance asynchronous Python web framework |
| | Uvicorn | Lightning-fast ASGI web server |
| | SQLAlchemy | Python SQL Toolkit and Object-Relational Mapper (ORM) |
| | Pydantic v2 | Data validation and JSON serialization |
| | HTTPX | Asynchronous HTTP client for API querying |
| **Data & Cache**| PostgreSQL | Relational database for persistent lead records |
| | Redis | In-memory key-value cache and Celery message broker |
| **Scraper** | Celery | Distributed background task queue |
| | Playwright | Headless Chromium automation for JavaScript rendering |
| | BeautifulSoup4 | HTML parser for anchor and DOM text extraction |
| | `phonenumbers` | Python port of Google's libphonenumber for E.164 normalization |
| **DevOps** | Docker & Compose | Multi-container orchestration for PostgreSQL and Redis |
| | Ngrok | Secure public ingress tunnel for remote testing |

---

## Architecture

```
                                  ┌───────────────────────┐
                                  │      Client / UI      │
                                  │ (React + Tailwind CSS)│
                                  └──────────┬────────────┘
                                             │
                                             │ HTTP / JSON (via Vite Proxy :5173)
                                             ▼
                                  ┌───────────────────────┐
                                  │   FastAPI Web Server  │
                                  │       (Port 8000)     │
                                  └─────┬───────────┬─────┘
                                        │           │
                     Query Cache Checks │           │ Save / Query Leads
                                        ▼           ▼
                             ┌──────────────┐   ┌──────────────┐
                             │ Redis Cache  │   │  PostgreSQL  │
                             │ (Port 6379)  │   │ (Port 5432)  │
                             └──────┬───────┘   └──────────────┘
                                    │
                                    │ Task Queue / Broker
                                    ▼
                             ┌──────────────┐
                             │Celery Worker │
                             │(Solo Pool Win)
                             └──────┬───────┘
                                    │
                         Spawns     ▼
              ┌──────────────────────────────────────────┐
              │      Playwright Headless Chromium        │
              │  Crawls: Homepage -> Subpages -> Socials │
              │  Normalizes Phone Numbers via libphone   │
              └──────────────────────────────────────────┘
```

---

## Project Structure

```
vendor-leadgen/
├── docker-compose.yml          # PostgreSQL & Redis container definitions
├── check_db.py                 # Diagnostic script to inspect Postgres leads table
├── reset_db.py                 # Database purge script to reset records to 0
├── testmain.py                 # Isolated sandbox API to test raw Google Places responses
├── .env.example                # Environment variable configuration template
├── .gitignore
│
├── backend/                    # FastAPI Backend Engine
│   ├── requirements.txt        # Python dependencies
│   └── app/
│       ├── main.py             # Server entry point & CORS configuration
│       ├── config.py           # Environment settings loader
│       ├── db.py               # Database engine & session lifecycles
│       ├── models.py           # SQLAlchemy database schemas
│       ├── schemas.py          # Pydantic request/response validation
│       ├── routers/
│       │   ├── search.py       # POST /search/ (Places queries, cache, scraping queue)
│       │   └── vendors.py      # GET /vendors/ & POST /vendors/{id}/scrape
│       ├── services/
│       │   ├── places_provider.py         # Abstract places interface
│       │   ├── google_places_provider.py  # Google Places API v1 (New) implementation
│       │   ├── cache.py                   # Redis caching functions
│       │   └── scraper.py                 # Playwright crawler & DOM extractor
│       └── tasks/
│           └── scrape.py       # Celery task definitions & E.164 verification
│
└── frontend/                   # React Client Application
    ├── package.json            # NPM dependencies & scripts
    ├── index.html              # HTML shell loading fonts & Leaflet CDN
    ├── vite.config.js          # Vite config with API reverse proxy mappings
    ├── tailwind.config.js      # Nothing Tech theme colors & typography
    ├── postcss.config.js       # PostCSS processor configuration
    └── src/
        ├── main.jsx            # React root mount
        ├── index.css           # Global dot-grid and pulsing map marker styles
        ├── App.jsx             # SPA application state and layout manager
        └── components/
            ├── Sidebar.jsx        # Navigation sidebar
            ├── SearchPanel.jsx    # Keyword and location input box
            ├── LeadsTable.jsx     # Leads data table with status badges
            ├── DetailsDrawer.jsx  # Slide-out lead detail drawer with scrape logs
            └── MapView.jsx        # Transparent Leaflet map component
```

---

## Prerequisites

Before running the project, ensure you have the following installed:
- **Python:** Version 3.10 to 3.13
- **Node.js:** Version 18.x or higher + `npm`
- **Docker Desktop:** Running with Docker Compose support
- **Google Cloud API Key:** With the **Places API (New)** enabled

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/vendor-leadgen.git
cd vendor-leadgen
```

### 2. Configure Environment Variables
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
playwright install chromium
cd ..
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

---

## Environment Variables

Configure these keys inside your root `.env` file:

```ini
# Database (PostgreSQL)
DATABASE_URL=postgresql://leadgen_user:leadgen_pass@localhost:5432/vendor_leadgen

# Cache & Message Broker (Redis)
REDIS_URL=redis://localhost:6379/0

# Google Cloud Places API (New)
GOOGLE_PLACES_API_KEY=AIzaSyYourSecretPlacesApiKeyHere

# Application Environment
ENVIRONMENT=development
```

---

## Running the Project

Run each service in a separate terminal window:

### Terminal 1: Infrastructure (Docker)
```bash
docker compose up -d
```

### Terminal 2: Backend API (FastAPI)
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
*API will be available at `http://127.0.0.1:8000`*

### Terminal 3: Scraping Worker (Celery)
```bash
cd backend
venv\Scripts\activate
# Windows requires --pool=solo
celery -A app.tasks.scrape.celery_app worker --pool=solo --loglevel=info
```

### Terminal 4: Frontend UI (Vite)
```bash
cd frontend
npm run dev
```
*UI will be available at `http://localhost:5173`*

### Terminal 5 (Optional): Remote Ngrok Ingress
```bash
npx ngrok http 5173
```

---

## Usage

1. **Overview Dashboard:** Review high-level statistics of all stored leads, categorized by verification status. Click any metric card to filter records instantly.
2. **Lead Finder:** Enter a search term (e.g. `Gyms`) and a location (e.g. `Udupi, Karnataka`). Click **Start** to execute the Google Places search.
3. **Load More Results:** Click **Load More Leads** at the bottom of search results to fetch the next 20 listings via Google Places token pagination.
4. **Inspect Lead:** Click **Details** on any row in the table to open the slide-out drawer, view extracted phone numbers/emails, and trigger manual re-scrapes.
5. **Map Navigation:** Navigate to the **Map View** tab to visualize active search listings or all database records plotted on an interactive map.

---

## API Documentation

Interactive OpenAPI / Swagger documentation is automatically generated by FastAPI and accessible at:
* **Swagger UI:** `http://127.0.0.1:8000/docs`
* **ReDoc:** `http://127.0.0.1:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description | Payload / Parameters |
|---|---|---|---|
| `POST` | `/search/` | Queries Google Places, checks Redis cache, saves to DB, queues scrape | `{"keyword": "cafes", "location": "Bangalore", "page_token": null}` |
| `GET` | `/vendors/` | Retrieves paginated and filtered lead records | `?skip=0&limit=100&status=verified` |
| `POST` | `/vendors/{id}/scrape` | Manually triggers a Celery scraping task for a vendor | Path parameter: `id` (Vendor ID) |
| `GET` | `/` | Health check endpoint | Returns `{"status": "running"}` |

---

## Model / Technical Details

### Database Schema (SQLAlchemy)
- **`vendors` Table:** Stores business metadata (`place_id`, `name`, `address`, `latitude`, `longitude`, `phone`, `website`, `scraped_phone`, `scraped_email`, `verification_status`, timestamps).
- **`searches` Table:** Stores audit logs of queries run (`keyword`, `location`, `result_count`, `run_at`).
- **`scrape_jobs` Table:** Tracks task execution state (`vendor_id`, `status`, `attempts`, `error_message`, timestamps).

### Verification Heuristics
```
[Scraper Output]
       │
       ├── Website unreachable / HTTP >= 400 ──> "dead_site"
       │
       ├── Phone found on site != Google Places Phone (E.164 normalized) ──> "mismatch"
       │
       ├── Extracted Email OR Phone matched ──> "verified"
       │
       └── Page loaded successfully but no contacts parsed ──> "no_contact_found"
```

---

## Testing

Utility scripts are included in the root directory for quick diagnostic testing:

- **Test Google Places API connection:**
  ```bash
  uvicorn testmain:app --reload --port 8001
  # Visit http://127.0.0.1:8001/test-search
  ```
- **Inspect database records:**
  ```bash
  python check_db.py
  ```
- **Purge database records back to 0:**
  ```bash
  python reset_db.py
  ```

---

## Deployment

### Local Tunnel Testing
The frontend `vite.config.js` is configured with `allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.loca.lt', '.lhr.life']` and a built-in reverse proxy routing `/vendors` and `/search` to `http://localhost:8000`. Exposing port `5173` via Ngrok or SSH (`localhost.run`) provides full remote access with zero CORS errors.

### Production Deployment Strategy
1. **Containerization:** Package the FastAPI backend and Celery worker into Docker images.
2. **Reverse Proxy:** Serve the built React static assets (`npm run build`) via NGINX or Caddy.
3. **Managed Services:** Provision managed PostgreSQL and Redis instances on AWS RDS / ElastiCache, DigitalOcean, or Railway.

---

## Limitations

- **Google Places API Quota:** API calls are subject to Google Cloud billing and quotas (mitigated by 24h Redis caching).
- **Aggressive Anti-Bot Protections:** Some vendor websites protected by Cloudflare/DataDome challenge screens may prevent automated contact extraction without residential proxies.
- **Windows Celery Concurrency:** Python 3.13 on Windows requires running Celery with `--pool=solo` due to billiard process limitations.

---

## Roadmap

- [x] Phase 1: Core API + Google Places integration + PostgreSQL + Redis
- [x] Phase 2: Web scraping verification layer with Celery & Playwright
- [x] Phase 3: Lead management UI with Nothing Tech theme
- [x] Phase 4: Token-based Places pagination ("Load More" results)
- [x] Phase 5: Interactive OpenStreetMap (Leaflet) view with coordinate auto-bounds
- [ ] Phase 6: Technographic signal detection (Shopify, WordPress, Wix detection)
- [ ] Phase 7: Export to CSV / Excel for CRM import (HubSpot / Salesforce)
- [ ] Phase 8: Automated cold-email AI outreach generator

---

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Authors

* **Nidhish** - *Project Lead & Architecture* - [@Nidhish36](https://github.com/Nidhish36)

---

## Acknowledgements

* [FastAPI Documentation](https://fastapi.tiangolo.com/)
* [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview)
* [Playwright Python](https://playwright.dev/python/)
* [Leaflet.js](https://leafletjs.com/)
* [OpenStreetMap](https://www.openstreetmap.org/)
* [Celery Project](https://docs.celeryq.dev/)
