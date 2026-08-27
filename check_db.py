import sys
import os

# Add backend directory to sys.path to allow imports
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from app.db import SessionLocal
from app.models import Vendor, ScrapeJob

db = SessionLocal()
try:
    print("=" * 60)
    print(f"{'VENDORS SCRAPING RESULT SUMMARY':^60}")
    print("=" * 60)
    
    vendors = db.query(Vendor).all()
    if not vendors:
        print("No vendors found in the database. Run a search first.")
        sys.exit(0)
        
    for v in vendors:
        print(f"Vendor ID: {v.id}")
        print(f"Name     : {v.name}")
        print(f"Website  : {v.website}")
        print(f"Original Phone (Google)  : {v.phone}")
        print(f"Scraped Phone (Website) : {v.scraped_phone}")
        print(f"Scraped Email (Website) : {v.scraped_email}")
        print(f"Verification Status     : {v.verification_status}")
        
        job = db.query(ScrapeJob).filter(ScrapeJob.vendor_id == v.id).first()
        if job:
            print(f"Scrape Job Status       : {job.status}")
            if job.error_message:
                print(f"Scrape Job Error        : {job.error_message}")
        print("-" * 60)
        
finally:
    db.close()
