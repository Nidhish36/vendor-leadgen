import httpx
import re
from bs4 import BeautifulSoup


PHONE_REGEX = re.compile(
    r'(\+?\d[\d\s\-().]{7,}\d)'
)
EMAIL_REGEX = re.compile(
    r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

CONTACT_PAGES = ["/contact", "/contact-us", "/about", "/about-us", "/reach-us"]


def extract_phone(text: str):
    matches = PHONE_REGEX.findall(text)
    for match in matches:
        digits = re.sub(r'\D', '', match)
        if 7 <= len(digits) <= 15:
            return match.strip()
    return None


def extract_email(soup: BeautifulSoup):
    # Check mailto links first
    for a in soup.find_all("a", href=True):
        if a["href"].startswith("mailto:"):
            return a["href"].replace("mailto:", "").strip()
    # Fall back to regex on page text
    text = soup.get_text()
    match = EMAIL_REGEX.search(text)
    return match.group(0) if match else None


def scrape_page(url: str):
    try:
        with httpx.Client(timeout=10, follow_redirects=True, headers=HEADERS) as client:
            resp = client.get(url)
            if resp.status_code >= 400:
                return None
            return BeautifulSoup(resp.text, "html.parser")
    except Exception:
        return None


def scrape_vendor_website(website_url: str) -> dict:
    # Step 1: try homepage
    soup = scrape_page(website_url)
    if soup is None:
        return {"status": "dead_site", "phone": None, "email": None}

    phone = extract_phone(soup.get_text())
    email = extract_email(soup)

    # Step 2: if no contact info on homepage, try contact/about pages
    if not phone or not email:
        base_url = website_url.rstrip("/")
        for path in CONTACT_PAGES:
            contact_soup = scrape_page(base_url + path)
            if contact_soup:
                if not phone:
                    phone = extract_phone(contact_soup.get_text())
                if not email:
                    email = extract_email(contact_soup)
            if phone and email:
                break

    return {
        "status": "ok",
        "phone": phone,
        "email": email,
    }