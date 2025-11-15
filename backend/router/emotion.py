from fastapi import APIRouter
import pandas as pd
import os
import json

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "data", "analisis_emosi.csv")

def safe_parse_list(value):
    """Safely parse list-like strings"""
    if pd.isna(value) or value == 'null' or value == '':
        return None
    
    try:
        # Handle string representation of lists
        if isinstance(value, str):
            # Remove brackets and quotes, split by comma
            if value.startswith('[') and value.endswith(']'):
                value = value[1:-1]
            if not value or value == 'NO_EMOTION':
                return None
            # Split and clean
            items = [item.strip().strip("'\"") for item in value.split(',')]
            return [item for item in items if item and item != 'NO_EMOTION']
    except:
        pass
    
    return None

def safe_float(value):
    """Safely convert to float"""
    try:
        if pd.isna(value) or value == 'null' or value == '':
            return None
        return float(value)
    except:
        return None

def safe_bool(value):
    """Safely convert to boolean"""
    if pd.isna(value) or value == 'null' or value == '':
        return False
    return str(value).strip().lower() == 'true'

def load_emotion_data():
    """Load emotion data with improved error handling"""
    try:
        print(f"📂 Loading data from: {CSV_PATH}")
        
        # Try different encodings
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
        df = None
        
        for encoding in encodings:
            try:
                df = pd.read_csv(
                    CSV_PATH,
                    encoding=encoding,
                    on_bad_lines='skip',
                    engine='python'
                )
                print(f"✅ Successfully loaded with encoding: {encoding}")
                break
            except Exception as e:
                continue
        
        if df is None:
            print("❌ Failed to load CSV with any encoding")
            return []
        
        print(f"📊 Raw data shape: {df.shape}")
        print(f"📋 Columns: {df.columns.tolist()}")
        
        # Clean column names (remove extra spaces)
        df.columns = df.columns.str.strip()
        
        # Process each row
        data = []
        skipped = 0
        
        for idx, row in df.iterrows():
            try:
                # Get text field
                text = str(row.get('text', '')).strip()
                if not text or text == 'nan':
                    skipped += 1
                    continue
                
                # Parse emotion keywords
                keywords_raw = row.get('emotion_keywords', None)
                emotion_keywords = safe_parse_list(keywords_raw)
                
                # Build record
                record = {
                    'text': text,
                    'text_clean': safe_parse_list(row.get('text_clean', None)),
                    'emotion': str(row.get('emotion', '')).strip().lower() if pd.notna(row.get('emotion')) else None,
                    'emotion_score': safe_float(row.get('emotion_score')),
                    'emotion_confidence': safe_float(row.get('emotion_confidence')),
                    'emotion_keywords': emotion_keywords,
                    'complaint': safe_bool(row.get('complaint', False)),
                    'sarcasm': safe_bool(row.get('sarcasm', False))
                }
                
                # Only add if emotion is valid
                if record['emotion'] and record['emotion'] not in ['nan', 'none', '']:
                    data.append(record)
                else:
                    skipped += 1
                    
            except Exception as e:
                skipped += 1
                continue
        
        print(f"✅ Successfully parsed: {len(data)} records")
        print(f"⚠️  Skipped: {skipped} records")
        
        # Print emotion distribution
        emotions = {}
        for record in data:
            emotion = record['emotion']
            emotions[emotion] = emotions.get(emotion, 0) + 1
        
        print(f"\n📊 Emotion Distribution:")
        for emotion, count in sorted(emotions.items(), key=lambda x: x[1], reverse=True):
            print(f"  - {emotion}: {count}")
        
        return data
        
    except Exception as e:
        print(f"❌ Error loading data: {str(e)}")
        import traceback
        traceback.print_exc()
        return []

# Load data on startup
print("\n🚀 Loading emotion data...")
data_records = load_emotion_data()
print(f"✅ Total records loaded: {len(data_records)}\n")

@router.get("/")
def get_emotion_data():
    """Get all emotion data"""
    return {
        "status": "success",
        "total_rows": len(data_records),
        "data": data_records
    }

@router.get("/stats")
def get_statistics():
    """Get statistical summary"""
    if not data_records:
        return {
            "status": "error",
            "message": "No data available"
        }
    
    # Emotion distribution
    emotion_dist = {}
    emotion_scores = {}
    emotion_counts = {}
    total_confidence = 0
    confidence_count = 0
    
    for record in data_records:
        emotion = record.get('emotion')
        if emotion:
            emotion_dist[emotion] = emotion_dist.get(emotion, 0) + 1
            
            score = record.get('emotion_score')
            if score is not None:
                if emotion not in emotion_scores:
                    emotion_scores[emotion] = 0
                    emotion_counts[emotion] = 0
                emotion_scores[emotion] += score
                emotion_counts[emotion] += 1
            
            confidence = record.get('emotion_confidence')
            if confidence is not None:
                total_confidence += confidence
                confidence_count += 1
    
    # Calculate averages
    avg_scores = {
        emotion: round(emotion_scores[emotion] / emotion_counts[emotion], 2)
        for emotion in emotion_scores
    }
    
    avg_confidence = total_confidence / confidence_count if confidence_count > 0 else 0
    
    # Calculate median confidence
    confidences = [r['emotion_confidence'] for r in data_records if r.get('emotion_confidence') is not None]
    confidences.sort()
    median_confidence = confidences[len(confidences) // 2] if confidences else 0
    
    # Count complaints and sarcasm
    complaints = sum(1 for d in data_records if d.get('complaint'))
    sarcasm = sum(1 for d in data_records if d.get('sarcasm'))
    
    return {
        "status": "success",
        "total_records": len(data_records),
        "emotion_distribution": emotion_dist,
        "average_emotion_scores": avg_scores,
        "average_confidence": round(avg_confidence, 3),
        "median_confidence": round(median_confidence, 3),
        "complaints": complaints,
        "sarcasm": sarcasm,
        "complaint_percentage": round(complaints / len(data_records) * 100, 2) if data_records else 0,
        "sarcasm_percentage": round(sarcasm / len(data_records) * 100, 2) if data_records else 0
    }

@router.get("/filter")
def filter_data(
    emotion: str = None,
    min_score: float = None,
    max_score: float = None,
    complaint: bool = None,
    sarcasm: bool = None
):
    """Filter emotion data by various criteria"""
    filtered = data_records
    
    if emotion:
        filtered = [d for d in filtered if d.get('emotion') == emotion.lower()]
    
    if min_score is not None:
        filtered = [d for d in filtered 
                   if d.get('emotion_score') is not None and d.get('emotion_score') >= min_score]
    
    if max_score is not None:
        filtered = [d for d in filtered 
                   if d.get('emotion_score') is not None and d.get('emotion_score') <= max_score]
    
    if complaint is not None:
        filtered = [d for d in filtered if d.get('complaint') == complaint]
    
    if sarcasm is not None:
        filtered = [d for d in filtered if d.get('sarcasm') == sarcasm]
    
    return {
        "status": "success",
        "filters_applied": {
            "emotion": emotion,
            "min_score": min_score,
            "max_score": max_score,
            "complaint": complaint,
            "sarcasm": sarcasm
        },
        "total_rows": len(filtered),
        "data": filtered
    }

@router.get("/emotions")
def get_emotion_list():
    """Get list of all unique emotions"""
    emotions = set(d.get('emotion') for d in data_records if d.get('emotion'))
    return {
        "status": "success",
        "emotions": sorted(list(emotions))
    }

@router.get("/emotions/{emotion_type}")
def get_by_emotion(emotion_type: str):
    """Filter by specific emotion type"""
    filtered = [d for d in data_records if d.get('emotion') == emotion_type.lower()]
    return {
        "status": "success",
        "emotion": emotion_type,
        "total_rows": len(filtered),
        "data": filtered
    }

@router.get("/high-emotion")
def get_high_emotion(min_score: float = 5.0):
    """Get records with high emotion scores"""
    filtered = [
        d for d in data_records 
        if d.get('emotion_score') and d.get('emotion_score') >= min_score
    ]
    return {
        "status": "success",
        "min_score": min_score,
        "total_rows": len(filtered),
        "data": filtered
    }

@router.get("/debug")
def debug_info():
    """Debug endpoint to check data loading"""
    sample_records = data_records[:5] if data_records else []
    
    emotion_counts = {}
    for record in data_records:
        emotion = record.get('emotion')
        if emotion:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    
    return {
        "status": "success",
        "total_records": len(data_records),
        "csv_path": CSV_PATH,
        "csv_exists": os.path.exists(CSV_PATH),
        "emotion_counts": emotion_counts,
        "sample_records": sample_records,
        "columns_expected": ["text", "text_clean", "emotion", "emotion_score", 
                            "emotion_confidence", "emotion_keywords", "complaint", "sarcasm"]
    }