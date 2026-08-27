from sqlalchemy import Column, Integer, String, Float, DateTime, func
from app.db import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String)           # from Google Places
    website = Column(String)
    business_status = Column(String)
    scraped_phone = Column(String)   # from scraping
    scraped_email = Column(String)   # from scraping
    verification_status = Column(String, default="unverified")
    source_keyword = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    last_scraped_at = Column(DateTime, nullable=True)


class Search(Base):
    __tablename__ = "searches"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, nullable=False)
    location = Column(String)
    result_count = Column(Integer, default=0)
    run_at = Column(DateTime, server_default=func.now())


class ScrapeJob(Base):
    __tablename__ = "scrape_jobs"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, nullable=False)
    status = Column(String, default="queued")  # queued/running/done/failed
    attempts = Column(Integer, default=0)
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime, server_default=func.now())
    finished_at = Column(DateTime, nullable=True)