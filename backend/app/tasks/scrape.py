from celery import Celery
from app.config import settings
from app.services.scraper import scrape_vendor_website
from app.db import SessionLocal
from app.models import Vendor, ScrapeJob

celery_app = Celery(
    "tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)


@celery_app.task(bind=True, max_retries=3)
def scrape_vendor_task(self, vendor_id: int):
    db = SessionLocal()
    try:
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if not vendor:
            return

        # Mark job as running
        job = db.query(ScrapeJob).filter(ScrapeJob.vendor_id == vendor_id).first()
        if job:
            job.status = "running"
            db.commit()

        if not vendor.website:
            vendor.verification_status = "no_website_found"
            if job:
                job.status = "done"
            db.commit()
            return

        # Do the actual scrape
        result = scrape_vendor_website(vendor.website)

        # Update vendor with scraped data
        vendor.scraped_phone = result.get("phone")
        vendor.scraped_email = result.get("email")

        if result["status"] == "dead_site":
            vendor.verification_status = "dead_site"
        elif result.get("phone") and vendor.phone and result["phone"] != vendor.phone:
            vendor.verification_status = "mismatch"
        elif result.get("phone") or result.get("email"):
            vendor.verification_status = "verified"
        else:
            vendor.verification_status = "no_contact_found"

        if job:
            job.status = "done"

        db.commit()

    except Exception as exc:
        if job:
            job.status = "failed"
            job.error_message = str(exc)
            db.commit()
        raise self.retry(exc=exc, countdown=30)
    finally:
        db.close()