# Backend/app/main.py

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os, requests
from .services.gemini_client import summarize_with_gemini

# 1) Create the FastAPI app
app = FastAPI()

# 2) CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# 3) Load API keys from .env
AIRNOW_KEY      = os.getenv("AIRNOW_API_KEY")
OPENAQ_KEY      = os.getenv("OPENAQ_API_KEY")
OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")

# 4) AQI endpoint (ZIP or city)
@app.get("/aqi")
async def get_aqi(city: str):
    # ZIP branch...
    if city.isdigit():
        resp = requests.get(
            "https://www.airnowapi.org/aq/observation/zipCode/current/",
            params={
                "format": "application/json",
                "zipCode": city,
                "distance": 25,
                "API_KEY": AIRNOW_KEY
            }
        )
        if resp.status_code != 200 or not resp.json():
            raise HTTPException(404, f"No AQI data for ZIP {city}")
        return {"aqi": resp.json()[0]["AQI"]}

    # City name branch (OpenAQ v3)
    resp = requests.get(
        "https://api.openaq.org/v3/latest",
        params={"city": city, "parameter": "pm25"},
        headers={"X-API-Key": OPENAQ_KEY}
    )
    if resp.status_code != 200:
        raise HTTPException(502, "Upstream AQ API error")
    results = resp.json().get("results", [])
    if not results:
        raise HTTPException(404, f"No data for city {city}")
    values = [loc["measurements"][0]["value"] for loc in results if loc.get("measurements")]
    if not values:
        raise HTTPException(404, "No PM2.5 values found")
    return {"aqi": round(sum(values)/len(values), 2)}

# 5) Weather endpoint (must come *after* `app = FastAPI()`)
@app.get("/weather")
async def get_weather(city: str):
    url = "https://pro.openweathermap.org/data/2.5/weather"
    resp = requests.get(url, params={
        "q": city,
        "APPID": OPENWEATHER_KEY,
        "units": "metric"
    })
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, f"Weather API error: {resp.text}")
    d = resp.json()
    return {
        "city":        d["name"],
        "description": d["weather"][0]["description"],
        "temp":        d["main"]["temp"],
        "feels_like":  d["main"]["feels_like"],
        "humidity":    d["main"]["humidity"]
    }

# 6) (Optional) Summary endpoint
@app.get("/summary")
async def get_summary(city: str):
    numeric = (await get_aqi(city))["aqi"]
    prompt  = f"The average PM2.5 in {city} is {numeric} µg/m³. Give a 2-sentence health advisory and one tip."
    writeup = summarize_with_gemini(prompt)
    return {"aqi": numeric, "summary": writeup}
