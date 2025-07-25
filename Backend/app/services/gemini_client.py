# backend/app/services/gemini_client.py

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()  # reads GEMINI_API_KEY

# initialize once
_client = genai.Client()

def summarize_with_gemini(text: str) -> str:
    resp = _client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Summarize in bullet points:\n\n{text}"
    )
    return resp.text
