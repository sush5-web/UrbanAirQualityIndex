# Backend/app/main.py

from dotenv import load_dotenv
load_dotenv()   # loads .env into os.environ

import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.gemini_client import summarize_with_gemini

app = FastAPI()

# Allow your React dev server to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Load API keys from .env
AIRNOW_KEY      = os.getenv("AIRNOW_API_KEY")
OPENAQ_KEY      = os.getenv("OPENAQ_API_KEY")        # unused now, but kept if needed
OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")
GEMINI_KEY      = os.getenv("GEMINI_API_KEY")

@app.get("/aqi")
async def get_aqi(city: str):
    """
    Return a simple AQI index (1–5) for a given city name by:
    1) Geocoding via OpenWeather
    2) Fetching current Air Pollution via OpenWeather
    """
    # 1) Geocode
    geo = requests.get(
        "http://api.openweathermap.org/geo/1.0/direct",
        params={"q": city, "limit": 1, "appid": OPENWEATHER_KEY}
    )
    if geo.status_code != 200 or not geo.json():
        raise HTTPException(404, f"Could not geocode city: {city}")
    loc = geo.json()[0]
    lat, lon = loc["lat"], loc["lon"]

    # 2) Air Pollution (AQI index 1–5)
    air = requests.get(
        "http://api.openweathermap.org/data/2.5/air_pollution",
        params={"lat": lat, "lon": lon, "appid": OPENWEATHER_KEY}
    )
    if air.status_code != 200:
        raise HTTPException(502, "Upstream Air Pollution API error")
    data = air.json().get("list", [])
    if not data:
        raise HTTPException(404, f"No AQI data for {city}")

    aqi_index = data[0]["main"]["aqi"]
    return {"aqi": aqi_index}


@app.get("/weather")
async def get_weather(city: str):
    """
    Return current weather for a given city via OpenWeather PRO.
    """
    resp = requests.get(
        "https://pro.openweathermap.org/data/2.5/weather",
        params={"q": city, "APPID": OPENWEATHER_KEY, "units": "metric"}
    )
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, f"Weather API error: {resp.text}")
    d = resp.json()
    return {
        "city":        d.get("name"),
        "description": d["weather"][0]["description"],
        "temp":        d["main"]["temp"],
        "feels_like":  d["main"]["feels_like"],
        "humidity":    d["main"]["humidity"],
    }


@app.get("/summary")
async def get_summary(city: str):
    """
    Return the AQI index plus a 2‑sentence health advisory via Gemini.
    """
    numeric = (await get_aqi(city))["aqi"]
    prompt = (
        f"The current Air Quality Index in {city} is {numeric} (1=Good,5=Very Poor). "
        "Please provide a 2-sentence health advisory and one quick tip."
    )
    writeup = summarize_with_gemini(prompt)
    return {"aqi": numeric, "summary": writeup}
