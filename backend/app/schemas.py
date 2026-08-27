from pydantic import BaseModel
from typing import Optional


class VendorOut(BaseModel):
    id: int
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    business_status: Optional[str] = None
    scraped_phone: Optional[str] = None
    scraped_email: Optional[str] = None
    verification_status: str

    class Config:
        from_attributes = True


class SearchRequest(BaseModel):
    keyword: str
    location: str