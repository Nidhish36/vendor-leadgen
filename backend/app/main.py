from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import Base, engine
from app.routers import search, vendors

Base.metadata.create_all(bind=engine)  # creates DB tables on startup

app = FastAPI(title="Vendor Lead-Gen Portal")

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)
app.include_router(vendors.router)


@app.get("/")
def root():
    return {"status": "running"}