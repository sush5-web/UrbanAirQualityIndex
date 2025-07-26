# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.aqi_service import get_aqi_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/summary")
def summary(city: str):
    try:
        return get_aqi_summary(city)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
