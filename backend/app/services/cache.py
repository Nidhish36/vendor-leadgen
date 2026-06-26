import json
import redis
from app.config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

CACHE_TTL_SECONDS = 60 * 60 * 24  # 24 hours


def make_cache_key(keyword: str, location: str) -> str:
    return f"search:{keyword.lower().strip()}:{location.lower().strip()}"


def get_cached_results(keyword: str, location: str):
    key = make_cache_key(keyword, location)
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    return None


def set_cached_results(keyword: str, location: str, results: list):
    key = make_cache_key(keyword, location)
    redis_client.set(key, json.dumps(results), ex=CACHE_TTL_SECONDS)