from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from collections import Counter
import re
from typing import List, Dict
from pathlib import Path

router = APIRouter()

# Path ke CSV - coba beberapa kemungkinan
CSV_PATHS = [
    Path(__file__).parent.parent / "data" / "df_gemini_labeled.csv",
    Path("backend/data/df_gemini_labeled.csv"),
    Path("data/df_gemini_labeled.csv"),
]

CSV_PATH = None
for path in CSV_PATHS:
    if path.exists():
        CSV_PATH = str(path)
        print(f"✅ Sentiment CSV found at: {CSV_PATH}")
        break

if CSV_PATH is None:
    print("⚠️ WARNING: Sentiment CSV file not found in any of these locations:")
    for path in CSV_PATHS:
        print(f"  - {path.absolute()}")
    CSV_PATH = str(CSV_PATHS[0])  # Use first path as fallback

# Stopwords bahasa Indonesia
STOPWORDS = {
    "yang",
    "dan",
    "di",
    "ke",
    "dari",
    "ini",
    "itu",
    "dengan",
    "untuk",
    "pada",
    "adalah",
    "atau",
    "dalam",
    "juga",
    "ada",
    "ya",
    "tidak",
    "jangan",
    "aja",
    "sih",
    "kan",
    "lah",
    "kah",
    "nya",
    "mu",
    "ku",
    "kamu",
    "aku",
    "saya",
    "anda",
    "dia",
    "mereka",
    "kita",
    "kami",
    "akan",
    "sudah",
    "telah",
    "sedang",
    "masih",
    "bisa",
    "dapat",
    "harus",
    "mau",
    "ingin",
    "boleh",
    "jadi",
    "jika",
    "kalau",
    "ketika",
    "karena",
    "sebab",
    "maka",
    "lalu",
    "kemudian",
    "namun",
    "tetapi",
    "walau",
    "meski",
    "saat",
    "waktu",
    "hari",
    "tahun",
    "bulan",
    "jam",
    "menit",
    "detik",
    "pagi",
    "siang",
    "sore",
    "malam",
    "kak",
    "bang",
    "pak",
    "bu",
    "mas",
    "mbak",
    "dek",
    "om",
    "tante",
    "bro",
    "sis",
    "gue",
    "gua",
    "lo",
    "lu",
    "doi",
    "gimana",
    "gmn",
    "gitu",
    "gt",
    "emang",
    "emg",
    "kayak",
    "kaya",
    "kyk",
    "kek",
    "yg",
    "dgn",
    "sm",
    "sama",
    "jg",
    "udh",
    "udah",
    "dah",
    "tuh",
    "toh",
    "dong",
    "deh",
    "kok",
    "woi",
    "woy",
    "hai",
    "halo",
    "oh",
    "ah",
    "ih",
    "eh",
    "nih",
    "tapi",
    "tp",
    "kalo",
    "klau",
    "klo",
    "skrg",
    "sekarang",
    "nanti",
    "besok",
    "kemarin",
    "kmrn",
    "lg",
    "lagi",
    "msh",
    "msih",
}


def extract_keywords(
    texts: List[str], min_length: int = 3, top_n: int = 5
) -> List[Dict]:
    """Extract top keywords from list of texts"""
    word_count = Counter()

    for text in texts:
        if not text or pd.isna(text):
            continue

        # Clean and split text
        words = re.sub(r"[^\w\s]", " ", str(text).lower()).split()

        # Filter words
        filtered_words = [
            word
            for word in words
            if len(word) >= min_length and word not in STOPWORDS and not word.isdigit()
        ]

        word_count.update(filtered_words)

    # Return top N keywords
    return [
        {"keyword": word, "count": count}
        for word, count in word_count.most_common(top_n)
    ]


@router.get("/analysis")
async def get_sentiment_analysis():
    """Get complete sentiment analysis data"""
    try:
        print(f"📊 Loading sentiment data from: {CSV_PATH}")

        # Check if file exists
        if not Path(CSV_PATH).exists():
            raise HTTPException(
                status_code=404, detail=f"CSV file not found at {CSV_PATH}"
            )

        # Load CSV
        df = pd.read_csv(CSV_PATH)
        print(f"✅ Loaded {len(df)} rows")
        print(f"📋 Columns available: {df.columns.tolist()}")

        # Check required columns
        if "sentiment_gemini" not in df.columns:
            raise HTTPException(
                status_code=400, detail="Column 'sentiment_gemini' not found in CSV"
            )

        # Normalize sentiment values
        df["sentiment_gemini"] = df["sentiment_gemini"].str.strip().str.lower()

        # Count sentiments
        sentiment_counts = {
            "positif": len(df[df["sentiment_gemini"].isin(["positif", "positive"])]),
            "netral": len(df[df["sentiment_gemini"].isin(["netral", "neutral"])]),
            "negatif": len(df[df["sentiment_gemini"].isin(["negatif", "negative"])]),
        }

        print(f"📈 Sentiment counts: {sentiment_counts}")

        # Extract texts for keywords - TERMASUK NEUTRAL
        positive_texts = df[df["sentiment_gemini"].isin(["positif", "positive"])][
            "text_clean_joined"
        ].tolist()
        negative_texts = df[df["sentiment_gemini"].isin(["negatif", "negative"])][
            "text_clean_joined"
        ].tolist()
        neutral_texts = df[df["sentiment_gemini"].isin(["netral", "neutral"])][
            "text_clean_joined"
        ].tolist()

        # Get top keywords - TERMASUK NEUTRAL
        top_positive_keywords = extract_keywords(positive_texts)
        top_negative_keywords = extract_keywords(negative_texts)
        top_neutral_keywords = extract_keywords(neutral_texts)

        print(
            f"🔑 Extracted keywords: {len(top_positive_keywords)} positive, {len(top_neutral_keywords)} neutral, {len(top_negative_keywords)} negative"
        )

        # Get sample comments for each sentiment
        positive_samples = []
        neutral_samples = []
        negative_samples = []

        # Prioritas kolom text
        text_column = None
        possible_columns = ["text_clean_joined", "text", "comment", "content"]
        for col in possible_columns:
            if col in df.columns:
                text_column = col
                print(f"✅ Using text column: {text_column}")
                break

        if text_column is None:
            print("⚠️ WARNING: No text column found!")
            text_column = df.columns[0]  # Fallback ke kolom pertama

        # Get positive samples - ambil 5 komentar yang tidak kosong
        positive_df = df[df["sentiment_gemini"].isin(["positif", "positive"])].copy()
        if len(positive_df) > 0 and text_column in positive_df.columns:
            # Filter out empty/null values dan ambil 5 samples
            valid_texts = positive_df[text_column].dropna()
            valid_texts = valid_texts[valid_texts.str.strip() != ""]
            samples = valid_texts.head(10).tolist()  # Ambil 10 untuk jaga-jaga
            positive_samples = [
                str(text).strip()[:300] for text in samples if str(text).strip()
            ][
                :5
            ]  # Ambil 5 terbaik
            print(f"✅ Got {len(positive_samples)} positive samples")

        # Get neutral samples
        neutral_df = df[df["sentiment_gemini"].isin(["netral", "neutral"])].copy()
        if len(neutral_df) > 0 and text_column in neutral_df.columns:
            valid_texts = neutral_df[text_column].dropna()
            valid_texts = valid_texts[valid_texts.str.strip() != ""]
            samples = valid_texts.head(10).tolist()
            neutral_samples = [
                str(text).strip()[:300] for text in samples if str(text).strip()
            ][:5]
            print(f"✅ Got {len(neutral_samples)} neutral samples")

        # Get negative samples
        negative_df = df[df["sentiment_gemini"].isin(["negatif", "negative"])].copy()
        if len(negative_df) > 0 and text_column in negative_df.columns:
            valid_texts = negative_df[text_column].dropna()
            valid_texts = valid_texts[valid_texts.str.strip() != ""]
            samples = valid_texts.head(10).tolist()
            negative_samples = [
                str(text).strip()[:300] for text in samples if str(text).strip()
            ][:5]
            print(f"✅ Got {len(negative_samples)} negative samples")

        # Debug: Print beberapa contoh
        if positive_samples:
            print(f"📝 Sample positive comment: {positive_samples[0][:100]}...")
        if neutral_samples:
            print(f"📝 Sample neutral comment: {neutral_samples[0][:100]}...")
        if negative_samples:
            print(f"📝 Sample negative comment: {negative_samples[0][:100]}...")

        # Timeline data (if date column exists)
        timeline_data = []
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")
            df_with_date = df.dropna(subset=["date"])

            if len(df_with_date) > 0:
                # Group by date
                timeline = (
                    df_with_date.groupby(df_with_date["date"].dt.date)
                    .apply(
                        lambda x: {
                            "positive": len(
                                x[x["sentiment_gemini"].isin(["positif", "positive"])]
                            ),
                            "negative": len(
                                x[x["sentiment_gemini"].isin(["negatif", "negative"])]
                            ),
                            "neutral": len(
                                x[x["sentiment_gemini"].isin(["netral", "neutral"])]
                            ),
                        }
                    )
                    .to_dict()
                )

                timeline_data = [
                    {
                        "date": str(date),
                        "positive": counts["positive"],
                        "negative": counts["negative"],
                        "neutral": counts["neutral"],
                    }
                    for date, counts in sorted(timeline.items())
                ]

        print(f"✅ Sentiment analysis complete!")
        print(
            f"📊 Returning {len(positive_samples)} positive, {len(neutral_samples)} neutral, {len(negative_samples)} negative samples"
        )

        return JSONResponse(
            content={
                "success": True,
                "data": {
                    "sentiment_count": sentiment_counts,
                    "top_positive_keywords": top_positive_keywords,
                    "top_negative_keywords": top_negative_keywords,
                    "top_neutral_keywords": top_neutral_keywords,  # DITAMBAHKAN INI
                    "timeline_data": timeline_data,
                    "total": sum(sentiment_counts.values()),
                    "sample_comments": {
                        "positive": positive_samples,
                        "neutral": neutral_samples,
                        "negative": negative_samples,
                    },
                },
            }
        )

    except Exception as e:
        print(f"❌ Error in sentiment analysis: {e}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
async def get_sentiment_summary():
    """Get sentiment summary statistics"""
    try:
        if not Path(CSV_PATH).exists():
            raise HTTPException(status_code=404, detail="CSV file not found")

        df = pd.read_csv(CSV_PATH)
        df["sentiment_gemini"] = df["sentiment_gemini"].str.strip().str.lower()

        total = len(df)
        positif = len(df[df["sentiment_gemini"].isin(["positif", "positive"])])
        netral = len(df[df["sentiment_gemini"].isin(["netral", "neutral"])])
        negatif = len(df[df["sentiment_gemini"].isin(["negatif", "negative"])])

        return JSONResponse(
            content={
                "success": True,
                "data": {
                    "total": total,
                    "positif": positif,
                    "netral": netral,
                    "negatif": negatif,
                    "positif_percentage": round(
                        (positif / total * 100) if total > 0 else 0, 2
                    ),
                    "netral_percentage": round(
                        (netral / total * 100) if total > 0 else 0, 2
                    ),
                    "negatif_percentage": round(
                        (negatif / total * 100) if total > 0 else 0, 2
                    ),
                },
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Test endpoint
@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify router is working"""
    return {
        "success": True,
        "message": "Sentiment router is working!",
        "csv_path": CSV_PATH,
        "csv_exists": Path(CSV_PATH).exists() if CSV_PATH else False,
    }
