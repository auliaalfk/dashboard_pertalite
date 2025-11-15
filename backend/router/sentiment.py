from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

# Path file CSV
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sentiment_data.csv")

@router.get("/all")
async def get_all_sentiment_data():
    """Mengembalikan seluruh data CSV (semua kolom tanpa diproses)"""
    try:
        df = pd.read_csv(DATA_PATH)
        return df.to_dict(orient="records")  # return semua kolom
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary")
async def get_sentiment_summary():
    try:
        df = pd.read_csv(DATA_PATH)
        summary = df["sentiment_gemini"].value_counts().to_dict()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
