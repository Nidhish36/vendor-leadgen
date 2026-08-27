# Google Places API (New) — Text Search Field Mask SKU Reference

Use this file when planning which fields to request.
**Rule: You're billed at the highest SKU tier triggered by ANY field in your request.**
So if you request one Enterprise field + five Pro fields, the whole call is billed at Enterprise.

---

## Essentials ID Only SKU (cheapest / free tier)
Only use these if you just need IDs for deduplication.

```
places.attributions
places.id
places.name          ← returns resource name (places/PLACE_ID), NOT the display text
nextPageToken
places.movedPlace
places.movedPlaceId
```

> Note: Use `places.displayName` (Pro) to get the actual readable name of the place.

---

## Pro SKU
Good for basic business info — name, address, location, status.

```
places.accessibilityOptions
places.addressComponents
places.addressDescriptor       ← generally available in India, experimental elsewhere
places.adrFormatAddress
places.businessStatus
places.containingPlaces
places.displayName             ← use this instead of places.name for readable name
places.formattedAddress
places.googleMapsLinks
places.googleMapsUri
places.iconBackgroundColor
places.iconMaskBaseUri
places.location
places.openingDate
places.photos
places.plusCode
places.postalAddress
places.primaryType
places.primaryTypeDisplayName
places.pureServiceAreaBusiness
places.shortFormattedAddress
places.searchUri
places.subDestinations
places.timeZone
places.types
places.utcOffsetMinutes
places.viewport
```

---

## Enterprise SKU (expensive — 1,000 free/month then billed per 1,000)
Phone numbers, ratings, website, opening hours live here.

```
places.currentOpeningHours
places.currentSecondaryOpeningHours
places.internationalPhoneNumber
places.nationalPhoneNumber        ← phone number
places.priceLevel
places.priceRange
places.rating                     ← rating
places.regularOpeningHours
places.regularSecondaryOpeningHours
places.transitStation
places.userRatingCount
places.websiteUri                 ← website URL  ← IMPORTANT: this is Enterprise, not Pro
```

---

## Enterprise + Atmosphere SKU (most expensive — avoid unless needed)
Amenity/vibe data — dine-in, delivery, reviews, etc.

```
places.allowsDogs
places.curbsidePickup
places.delivery
places.dineIn
places.editorialSummary
places.evChargeAmenitySummary
places.evChargeOptions
places.fuelOptions
places.generativeSummary
places.goodForChildren
places.goodForGroups
places.goodForWatchingSports
places.liveMusic
places.menuForChildren
places.neighborhoodSummary
places.parkingOptions
places.paymentOptions
places.outdoorSeating
places.reservable
places.restroom
places.reviews
places.reviewSummary
routingSummaries                  ← Text Search and Nearby Search only
places.servesBeer
places.servesBreakfast
places.servesBrunch
places.servesCocktails
places.servesCoffee
places.servesDessert
places.servesDinner
places.servesLunch
places.servesVegetarianFood
places.servesWine
places.takeout
```

---

## Current field mask used in this project

```python
FIELD_MASK = ",".join([
    "places.id",              # Essentials
    "places.displayName",     # Pro
    "places.formattedAddress",# Pro
    "places.location",        # Pro
    "places.businessStatus",  # Pro
    "places.websiteUri",      # Enterprise ← needed for scraping
])
```

**Current billing tier: Enterprise** (because of `websiteUri`)
**Free quota: ~1,000 requests/month** before charges kick in.

---

## Key decisions for this project

- `nationalPhoneNumber` removed — we get phone via scraping instead (saves Enterprise cost)
- `rating` removed — we don't sort by rating; we auto-scrape vendors that have a website
- `websiteUri` kept — required to know which URL to scrape
- If we ever need to drop to Pro tier, remove `websiteUri` and only scrape vendors
  where we can find the website via a fallback search ("{name} {city}")

---

## Pricing (INR, as of June 2026 — verify in Google Cloud Console)

| SKU | Free/month | Then costs |
|---|---|---|
| Essentials | 10,000 | ₹478.50 per 1,000 |
| Pro | 5,000 | ₹3,062.40 per 1,000 |
| Enterprise | 1,000 | ₹1,914.00 per 1,000 |
| Enterprise + Atmosphere | 1,000 | ₹2,392.50 per 1,000 |

> Always verify current pricing at: console.cloud.google.com → Billing → Pricing
