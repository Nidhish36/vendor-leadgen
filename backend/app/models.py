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
    phone = Column(String)
    website = Column(String)
    rating = Column(Float)
    business_status = Column(String)
    verification_status = Column(String, default="unverified")
    source_keyword = Column(String)
    created_at = Column(DateTime, server_default=func.now())


class Search(Base):
    __tablename__ = "searches"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, nullable=False)
    location = Column(String)
    result_count = Column(Integer, default=0)
    run_at = Column(DateTime, server_default=func.now())