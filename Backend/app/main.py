from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os, requests

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

OW_KEY = os.getenv("OPENWEATHER_API_KEY")

# EPA PM2.5 → AQI conversion
def pm25_to_aqi(c: float) -> int:
    breakpoints = [
      (0.0,   12.0,   0,  50),
      (12.1,  35.4,  51, 100),
      (35.5,  55.4, 101, 150),
      (55.5, 150.4, 151, 200),
      (150.5,250.4, 201, 300),
      (250.5,350.4, 301, 400),
      (350.5,500.4, 401, 500),
    ]
    for lo, hi, ilo, ihi in breakpoints:
        if lo <= c <= hi:
            return round((ihi-ilo)/(hi-lo)*(c-lo) + ilo)
    raise ValueError("PM2.5 out of range")

@app.get("/aqi")
async def get_aqi(city: str):
    # 1) Geocode
    geo = requests.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        params={"q": city, "limit": 1, "appid": OW_KEY}
    )
    if geo.status_code != 200 or not geo.json():
        raise HTTPException(404, f"Location not found: {city}")
    loc = geo.json()[0]
    lat, lon = loc["lat"], loc["lon"]

    # 2) Air Pollution
    air = requests.get(
        "https://api.openweathermap.org/data/2.5/air_pollution",
        params={"lat": lat, "lon": lon, "appid": OW_KEY}
    )
    if air.status_code != 200:
        raise HTTPException(502, f"AirPollution API error: {air.text}")
    comp = air.json().get("list", [{}])[0].get("components", {})
    pm25 = comp.get("pm2_5")
    if pm25 is None:
        raise HTTPException(404, f"No PM2.5 data for {city}")

    # 3) Convert & return
    return {"aqi": pm25_to_aqi(pm25)}
