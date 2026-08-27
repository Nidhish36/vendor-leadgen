import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from app.db import SessionLocal
from app.models import Vendor, ScrapeJob

db = SessionLocal()
try:
    print("Resetting all vendor scraping data in database...")
    
    # Reset all vendors back to unverified
    db.query(Vendor).update({
        Vendor.scraped_phone: None,
        Vendor.scraped_email: None,
        Vendor.verification_status: "unverified",
        Vendor.last_scraped_at: None
    })
    
    # Delete all previous scrape job records
    db.query(ScrapeJob).delete()
    
    db.commit()
    print("Database reset successfully! All vendors are now 'unverified'.")
    print("You can run your search query again to trigger the new scraper.")
    
except Exception as e:
    db.rollback()
    print(f"Error resetting database: {e}")
finally:
    db.close()
