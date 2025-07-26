# backend/app/main.py

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Missing Google API key")

@app.get("/summary")
def get_air_quality_summary(lat: float = Query(...), lon: float = Query(...)):
    try:
        # Reverse geocoding to get city & country
        geo_response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "latlng": f"{lat},{lon}",
                "key": GOOGLE_API_KEY
            }
        ).json()

        city = country = ""
        if geo_response["status"] == "OK":
            for comp in geo_response["results"][0]["address_components"]:
                if "locality" in comp["types"]:
                    city = comp["long_name"]
                if "country" in comp["types"]:
                    country = comp["short_name"]

        # AQI data fetch
        aqi_response = requests.post(
            f"https://airquality.googleapis.com/v1/currentConditions:lookup?key={GOOGLE_API_KEY}",
            json={
                "universalAqi": True,
                "location": {
                    "latitude": lat,
                    "longitude": lon
                }
            }
        ).json()

        if "indexes" not in aqi_response:
            return {"detail": "No AQI data found"}

        aqi_info = aqi_response["indexes"][0]

        return {
            "city": city,
            "country": country,
            "latitude": lat,
            "longitude": lon,
            "aqi": aqi_info["aqi"],
            "category": aqi_info["category"],
            "dominantPollutant": aqi_info["dominantPollutant"],
            "rgbColor": aqi_info["color"],
            "source": "Google Air Quality API"
        }

    except Exception as e:
        return {"detail": f"Unexpected error: {str(e)}"}
