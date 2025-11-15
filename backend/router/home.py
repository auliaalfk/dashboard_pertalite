from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

# Path ke file CSV untuk menu Home
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "pertalite_data.csv")

@router.get("/all")
async def get_home_data():
    """Mengambil seluruh data Home (semua kolom apa adanya)"""
    try:
        df = pd.read_csv(DATA_PATH)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
