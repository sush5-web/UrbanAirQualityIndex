from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
import os

# Load env vars
MONGO_URI = os.getenv("MONGO_URI")

app = FastAPI()
client = MongoClient(MONGO_URI)
db = client.aqi_db

class AQIRequest(BaseModel):
    city: str

@app.get("/api/current")
async def get_current_aqi(city: str):
    # Fetch latest AQI from MongoDB
    return {"city": city, "aqi": 42}

@app.get("/api/forecast")
async def get_forecast(city: str):
    # Run your ML model or lookup
    return {"city": city, "forecast": [40, 45, 50]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)