from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Vendor, Search
from app.schemas import SearchRequest, VendorOut
from app.services.google_places_provider import GooglePlacesProvider
from app.services.cache import get_cached_results, set_cached_results

router = APIRouter(prefix="/search", tags=["search"])
provider = GooglePlacesProvider()


@router.post("/", response_model=list[VendorOut])
async def run_search(payload: SearchRequest, db: Session = Depends(get_db)):

    # Step 1: check cache — if same search was done before, skip Google API
    cached = get_cached_results(payload.keyword, payload.location)
    if cached:
        results = cached
    else:
        results = await provider.search_places(payload.keyword, payload.location)
        set_cached_results(payload.keyword, payload.location, results)

    # Step 2: save to DB, skip if already exists (deduped by place_id)
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
            rating=r["rating"],
            business_status=r["business_status"],
            source_keyword=payload.keyword,
        )
        db.add(vendor)
        saved_vendors.append(vendor)

    # Step 3: log the search
    db.add(Search(
        keyword=payload.keyword,
        location=payload.location,
        result_count=len(results)
    ))
    db.commit()

    return saved_vendors