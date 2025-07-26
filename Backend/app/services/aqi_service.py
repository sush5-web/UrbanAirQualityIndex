# app/services/aqi_service.py

import os
import requests
import json

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Missing Google API key")


def get_coordinates(city_name: str):
    geocoding_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": city_name,
        "key": GOOGLE_API_KEY
    }
    response = requests.get(geocoding_url, params=params)
    response.raise_for_status()
    data = response.json()

    if not data.get("results"):
        raise ValueError("No location found for the given city name")

    location = data["results"][0]["geometry"]["location"]
    lat = location["lat"]
    lng = location["lng"]
    return lat, lng


def get_aqi_summary(city_name: str):
    lat, lng = get_coordinates(city_name)

    print(f"City: {city_name}, Coordinates: {lat}, {lng}")  # Debug print

    aqi_url = "https://airquality.googleapis.com/v1/currentConditions:lookup"
    params = {
        "key": GOOGLE_API_KEY
    }
    headers = {
        "Content-Type": "application/json"
    }
    body = {
        "universalAqi": True,
        "location": {
            "latitude": lat,
            "longitude": lng
        }
    }

    response = requests.post(aqi_url, headers=headers, params=params, json=body)
    response.raise_for_status()
    aqi_data = response.json()

    print("Google Air Quality API Raw Response:", json.dumps(aqi_data, indent=2))  # Debug print

    indexes = aqi_data.get("indexes", [])
    if not indexes:
        raise ValueError("Missing AQI data in response")

    result = {
        "city": city_name,
        "location": aqi_data.get("regionCode", "Unknown"),
        "indexes": indexes,
        "pollutants": aqi_data.get("pollutants", []),
        "healthRecommendations": aqi_data.get("healthRecommendations", {}),
        "source": "Google Air Quality API"
    }

    return result
