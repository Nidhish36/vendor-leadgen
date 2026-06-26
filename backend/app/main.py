from fastapi import FastAPI
from app.db import Base, engine
from app.routers import search

Base.metadata.create_all(bind=engine)  # creates DB tables on startup

app = FastAPI(title="Vendor Lead-Gen Portal")
app.include_router(search.router)


@app.get("/")
def root():
    return {"status": "running"}