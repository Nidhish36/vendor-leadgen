import httpx
from app.config import settings
from app.services.places_provider import PlacesProvider


class GooglePlacesProvider(PlacesProvider):
    BASE_URL = "https://places.googleapis.com/v1/places:searchText"

    FIELD_MASK = ",".join([
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.businessStatus",
    ])

    async def search_places(self, keyword: str, location: str) -> list[dict]:
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": settings.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": self.FIELD_MASK,
        }
        payload = {
            "textQuery": f"{keyword} in {location}",
            "maxResultCount": 20,
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(
                self.BASE_URL,
                headers=headers,
                json=payload
            )
            resp.raise_for_status()
            data = resp.json()

        results = []
        for place in data.get("places", []):
            results.append({
                "place_id": place.get("id"),
                "name": place.get("displayName", {}).get("text", "Unknown"),
                "address": place.get("formattedAddress"),
                "latitude": place.get("location", {}).get("latitude"),
                "longitude": place.get("location", {}).get("longitude"),
                "phone": place.get("nationalPhoneNumber"),
                "website": place.get("websiteUri"),
                "business_status": place.get("businessStatus"),
            })

        return results