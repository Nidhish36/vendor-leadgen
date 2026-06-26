from fastapi import FastAPI
import httpx
import os
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

@app.get("/test-search")
async def test_search():

    url = "https://places.googleapis.com/v1/places:searchText"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName"
    }

    payload = {
        "textQuery": "restaurants in Bangalore"
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=payload)

    return resp.json()