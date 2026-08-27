from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Vendor, Search, ScrapeJob
from app.schemas import SearchRequest, VendorOut
from app.services.google_places_provider import GooglePlacesProvider
from app.services.cache import get_cached_results, set_cached_results
from app.tasks.scrape import scrape_vendor_task

router = APIRouter(prefix="/search", tags=["search"])
provider = GooglePlacesProvider()


@router.post("/", response_model=list[VendorOut])
async def run_search(payload: SearchRequest, db: Session = Depends(get_db)):

    # Step 1: check cache
    cached = get_cached_results(payload.keyword, payload.location)
    if cached:
        results = cached
    else:
        results = await provider.search_places(payload.keyword, payload.location)
        set_cached_results(payload.keyword, payload.location, results)

    # Step 2: save to DB
    saved_vendors = []
    for r in results:
        existing = db.query(Vendor).filter(Vendor.place_id == r["place_id"]).first()
        if existing:
            saved_vendors.append(existing)
            continue

        vendor = Vendor(
            place_id=r["place_id"],
            name=r["name"],
            address=r["address"],
            latitude=r["latitude"],
            longitude=r["longitude"],
            phone=r["phone"],
            website=r["website"],
            business_status=r["business_status"],
            source_keyword=payload.keyword,
        )
        db.add(vendor)
        db.flush()  # get the vendor.id before commit
        saved_vendors.append(vendor)

    db.add(Search(
        keyword=payload.keyword,
        location=payload.location,
        result_count=len(results)
    ))
    db.commit()

    # Step 3: auto-scrape vendors that have a website (top 10)
    vendors_with_website = [v for v in saved_vendors if v.website][:10]
    for vendor in vendors_with_website:
        # only queue if not already scraped
        if vendor.verification_status == "unverified":
            job = ScrapeJob(vendor_id=vendor.id, status="queued")
            db.add(job)
            db.commit()
            scrape_vendor_task.delay(vendor.id)

    return saved_vendors