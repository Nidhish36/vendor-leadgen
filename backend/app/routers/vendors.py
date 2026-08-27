from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.db import get_db
from app.models import Vendor, ScrapeJob
from app.schemas import VendorOut
from app.tasks.scrape import scrape_vendor_task

router = APIRouter(prefix="/vendors", tags=["vendors"])

@router.get("/", response_model=dict)
def get_vendors(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vendor)
    
    if search:
        query = query.filter(Vendor.name.ilike(f"%{search}%"))
        
    if status:
        query = query.filter(Vendor.verification_status == status)
        
    total = query.count()
    offset = (page - 1) * limit
    items = query.order_by(Vendor.id.desc()).offset(offset).limit(limit).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items
    }

@router.get("/{vendor_id}", response_model=VendorOut)
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.post("/{vendor_id}/scrape")
def trigger_scrape(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
        
    # Check if a job already exists, reset it or create a new one
    job = db.query(ScrapeJob).filter(ScrapeJob.vendor_id == vendor_id).first()
    if job:
        job.status = "queued"
        job.error_message = None
    else:
        job = ScrapeJob(vendor_id=vendor_id, status="queued")
        db.add(job)
        
    # Reset vendor status back to unverified before starting scrape
    vendor.verification_status = "unverified"
    db.commit()
    
    scrape_vendor_task.delay(vendor_id)
    return {"message": "Scrape task triggered successfully", "vendor_id": vendor_id}
