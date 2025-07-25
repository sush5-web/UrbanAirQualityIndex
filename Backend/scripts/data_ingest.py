from dotenv import load_dotenv
load_dotenv() 

import os
import requests
from datetime import datetime, timedelta
from pymongo import MongoClient
from app.services.gemini_client import summarize_with_gemini

daily_text = "Yesterday's AQI in LA…"
print(summarize_with_gemini(daily_text))


# Configuration via environment variables
MONGODB_URI = os.getenv("MONGODB_URI")  # MongoDB Atlas connection string
AIRNOW_API_KEY = os.getenv("AIRNOW_API_KEY")

# API Endpoints
OPENAQ_MEASUREMENTS_URL = "https://api.openaq.org/v2/measurements"
AIRNOW_BASE_URL = "https://www.airnowapi.org/aq/observation/zipCode"

# MongoDB setup
client = MongoClient(MONGODB_URI)
db = client["air_quality"]
historical_col = db["historical_measurements"]
realtime_col = db["realtime_measurements"]

def fetch_openaq(city: str, parameter: str, start_date: datetime, end_date: datetime):
    """
    Fetch historical measurements from OpenAQ for a given city and pollutant.
    Inserts results into MongoDB 'historical_measurements'.
    """
    params = {
        "city": city,
        "parameter": parameter,
        "date_from": start_date.isoformat(),
        "date_to": end_date.isoformat(),
        "limit": 10000,
        "page": 1
    }
    all_results = []
    while True:
        resp = requests.get(OPENAQ_MEASUREMENTS_URL, params=params)
        resp.raise_for_status()
        data = resp.json().get("results", [])
        if not data:
            break
        all_results.extend(data)
        if len(data) < params["limit"]:
            break
        params["page"] += 1
    if all_results:
        historical_col.insert_many(all_results)
    return all_results

def fetch_airnow(zip_code: str, distance: int = 25):
    """
    Fetch real-time and yesterday's historical readings from AirNow by zip code.
    Inserts results into MongoDB 'realtime_measurements' and 'historical_measurements'.
    """
    # Real-time current readings
    current_params = {
        "format": "application/json",
        "zipCode": zip_code,
        "distance": distance,
        "API_KEY": AIRNOW_API_KEY
    }
    current_resp = requests.get(f"{AIRNOW_BASE_URL}/current/", params=current_params)
    current_resp.raise_for_status()
    current_data = current_resp.json()
    if current_data:
        realtime_col.insert_many(current_data)
    
    # Yesterday's historical readings
    yesterday = datetime.utcnow() - timedelta(days=1)
    hist_params = {
        "format": "application/json",
        "zipCode": zip_code,
        "date": yesterday.strftime("%Y-%m-%dT%H"),
        "distance": distance,
        "API_KEY": AIRNOW_API_KEY
    }
    hist_resp = requests.get(f"{AIRNOW_BASE_URL}/historical/", params=hist_params)
    hist_resp.raise_for_status()
    histor_data = hist_resp.json()
    if histor_data:
        historical_col.insert_many(histor_data)
        
    return current_data, histor_data

if __name__ == "__main__":
    # Example usage:
    city_name = "Los Angeles"
    pollutant = "pm25"
    end = datetime.utcnow()
    start = end - timedelta(days=7)
    
    print(f"Fetching historical data from OpenAQ for {city_name} ({pollutant})...")
    hist_results = fetch_openaq(city_name, pollutant, start, end)
    print(f"Inserted {len(hist_results)} historical records into MongoDB.")
    
    zip_code = "90001"
    print(f"Fetching AirNow data for zip code {zip_code}...")
    current, historical = fetch_airnow(zip_code)
    print(f"Inserted {len(current)} current readings and {len(historical)} historical readings into MongoDB.")
