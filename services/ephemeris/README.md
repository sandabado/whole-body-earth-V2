# Whole Body Ephemeris Service

Server-only Swiss Ephemeris calculation service for Whole Body Design readings. It exposes one authenticated, uncached endpoint and never stores birth data.

## Before deployment

Resolve the Swiss Ephemeris license gate in [LICENSE-NOTICE.md](./LICENSE-NOTICE.md). For a commercial deployment, retain the completed Swiss Ephemeris Professional license record with the project documentation.

## Local run

```bash
npm install
EPHEMERIS_API_KEY=local-development-key npm run dev
```

Then verify the service with:

```bash
curl -H "X-API-Key: local-development-key" "http://localhost:8787/natal?date=1990-06-15&time=12:00&lat=34.0522&lon=-118.2437&houseSystem=placidus"
```

## Deployment contract

Deploy the Docker service on a long-running Node-compatible platform. Set:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | Yes | Set to `production`. Production refuses to start without an API key. |
| `EPHEMERIS_API_KEY` | Yes | Long random secret required on every `/natal` request. |
| `ALLOWED_ORIGINS` | Yes | Comma-separated browser origins, e.g. `https://wholebody.earth,https://www.wholebody.earth`. |
| `PORT` | No | Defaults to `8787`. Most hosts set this automatically. |

After deployment, configure the web app:

```bash
SWISSEPH_API_URL=https://<your-ephemeris-service-domain>
SWISSEPH_API_KEY=<same value as EPHEMERIS_API_KEY>
```

Set both variables in Vercel for Production and Preview. They are server-only; never prefix them with `NEXT_PUBLIC_`.

## API contract

`GET /health` is public. `GET /natal` requires `X-API-Key` when configured and accepts:

```text
date=YYYY-MM-DD
time=HH:MM              # optional; local noon is used when omitted
lat=<latitude>
lon=<longitude>
houseSystem=placidus    # optional
```

The service derives an IANA timezone from the coordinates and converts local civil time to UTC before calculating a tropical natal chart. It rejects ambiguous or non-existent daylight-saving transition times instead of guessing. The website excludes time-bound placements when the optional birth time is omitted.
