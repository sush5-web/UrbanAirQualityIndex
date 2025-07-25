from dotenv import load_dotenv
load_dotenv()   # now os.getenv("GEMINI_API_KEY"), etc. will work

from fastapi import FastAPI 
from pydantic import BaseModel
from pymongo import MongoClient
from Backend.app.services.gemini_client import summarize_with_gemini

import os

# Load env vars
MONGO_URI = os.getenv("MONGO_URI")

app = FastAPI()
client = MongoClient(MONGO_URI)
db = client.aqi_db

class AQIRequest(BaseModel):
    city: str

@app.get("/summary/")
def get_summary(q: str):
    return {"summary": summarize_with_gemini(q)}

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