from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import pickle
import os
import pandas as pd
from gensim.models import LdaModel
from gensim import corpora
import google.generativeai as genai
from collections import Counter
import ast

# Initialize router
router = APIRouter()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCggzSNelIiR_tfCrKYb9KxKt8PJS4a-L4")
genai.configure(api_key=GEMINI_API_KEY)

# Model paths
MODEL_DIR = "backend/model/best_model"
LDA_MODEL_PATH = f"{MODEL_DIR}/lda_model.model"
DICTIONARY_PATH = f"{MODEL_DIR}/dictionary.dict"
METADATA_PATH = f"{MODEL_DIR}/model_metadata.pkl"

# Data path
DATA_PATH = "backend/data/pertalite_data.csv"

# Global variables untuk cache
_lda_model = None
_dictionary = None
_metadata = None
_corpus = None
_df_data = None
_topic_stats = None

# ============ Pydantic Models ============
class TopicInfo(BaseModel):
    id: int
    name: str
    keywords: List[str]
    posts: int
    percentage: float
    color: str

class TopicDistribution(BaseModel):
    topic: str
    value: float

class TopicModelingResponse(BaseModel):
    topics: List[TopicInfo]
    distribution: List[TopicDistribution]
    total_documents: int
    model_info: Dict[str, Any]

# ============ Helper Functions ============
def load_model():
    """Load LDA model, dictionary, dan metadata"""
    global _lda_model, _dictionary, _metadata
    
    try:
        if _lda_model is None:
            print("Loading LDA model...")
            _lda_model = LdaModel.load(LDA_MODEL_PATH)
            print("✓ LDA model loaded")
        
        if _dictionary is None:
            print("Loading dictionary...")
            _dictionary = corpora.Dictionary.load(DICTIONARY_PATH)
            print("✓ Dictionary loaded")
        
        if _metadata is None and os.path.exists(METADATA_PATH):
            print("Loading metadata...")
            with open(METADATA_PATH, 'rb') as f:
                _metadata = pickle.load(f)
            print("✓ Metadata loaded")
        
        return _lda_model, _dictionary, _metadata
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

def load_data():
    """Load pertalite_data"""
    global _df_data
    
    try:
        if _df_data is None:
            print("Loading data...")
            _df_data = pd.read_csv(DATA_PATH)
            print(f"✓ Data loaded: {len(_df_data)} documents")
            print(f"Columns available: {list(_df_data.columns)}")
        
        return _df_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")

def parse_tokens(text_clean):
    """
    Parse tokens dari berbagai format:
    - String list: "['kata1', 'kata2']"
    - String biasa: "kata1 kata2 kata3"
    - List: ['kata1', 'kata2']
    """
    try:
        if pd.isna(text_clean):
            return []
        
        # Jika sudah list
        if isinstance(text_clean, list):
            return [str(token).strip().strip("'\"") for token in text_clean]
        
        text_clean = str(text_clean).strip()
        
        # Jika format list string: "['kata1', 'kata2']"
        if text_clean.startswith('[') and text_clean.endswith(']'):
            try:
                tokens = ast.literal_eval(text_clean)
                return [str(token).strip().strip("'\"") for token in tokens]
            except:
                # Fallback: manual parsing
                tokens = text_clean.strip('[]').replace("'", "").replace('"', '').split(',')
                return [token.strip() for token in tokens if token.strip()]
        
        # String biasa
        return [token.strip() for token in text_clean.split() if token.strip()]
    
    except Exception as e:
        print(f"Error parsing tokens: {e} | Input: {text_clean}")
        return []

def build_corpus():
    """Build corpus dari data"""
    global _corpus, _df_data, _dictionary
    
    try:
        if _corpus is None:
            if _df_data is None:
                load_data()
            if _dictionary is None:
                load_model()
            
            print("\n" + "="*60)
            print("BUILDING CORPUS")
            print("="*60)
            
            # Gunakan kolom text_clean
            if 'text_clean' not in _df_data.columns:
                raise ValueError("Data must have 'text_clean' column")
            
            _corpus = []
            errors = 0
            success = 0
            
            print(f"Total documents to process: {len(_df_data)}")
            
            for idx, text_clean in enumerate(_df_data['text_clean']):
                tokens = parse_tokens(text_clean)
                
                if tokens:
                    bow = _dictionary.doc2bow(tokens)
                    if bow:  # Check if bow is not empty
                        _corpus.append(bow)
                        success += 1
                    else:
                        _corpus.append([])
                        errors += 1
                else:
                    errors += 1
                    _corpus.append([])  # Empty bow
                
                if idx % 500 == 0:
                    print(f"Processing: {idx}/{len(_df_data)} | Success: {success} | Failed: {errors}")
            
            print("\n" + "-"*60)
            print(f"RESULTS:")
            print(f"  Total: {len(_corpus)} documents")
            print(f"  Success: {success} documents with valid BoW")
            print(f"  Failed: {errors} empty/invalid documents")
            print(f"  Success rate: {(success/len(_corpus)*100):.2f}%")
            print("-"*60)
            
            if success == 0:
                print("\n⚠️ CRITICAL: No valid documents in corpus!")
                print("This means:")
                print("  1. text_clean parsing failed")
                print("  2. OR dictionary doesn't match your tokens")
                print("\nPlease check:")
                print("  - Is text_clean column populated?")
                print("  - Sample value:", _df_data['text_clean'].iloc[0])
            
            print("\n✓ Corpus building completed")
            print("="*60 + "\n")
        
        return _corpus
    
    except Exception as e:
        import traceback
        print("\n❌ ERROR in build_corpus:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error building corpus: {str(e)}")

def calculate_topic_statistics():
    """Calculate real topic distribution dari corpus"""
    global _topic_stats, _lda_model, _corpus
    
    try:
        if _topic_stats is None:
            if _lda_model is None:
                load_model()
            if _corpus is None:
                build_corpus()
            
            print("\n" + "="*60)
            print("CALCULATING TOPIC STATISTICS")
            print("="*60)
            
            topic_counts = Counter()
            valid_docs = 0
            empty_docs = 0
            
            for idx, doc in enumerate(_corpus):
                if not doc:  # Skip empty documents
                    empty_docs += 1
                    continue
                
                doc_topics = _lda_model.get_document_topics(doc, minimum_probability=0.0)
                
                if doc_topics:
                    valid_docs += 1
                    # Get dominant topic
                    dominant_topic = max(doc_topics, key=lambda x: x[1])[0]
                    topic_counts[dominant_topic] += 1
                
                if idx % 500 == 0:
                    print(f"Processing: {idx}/{len(_corpus)} | Valid: {valid_docs} | Empty: {empty_docs}")
            
            print("\n" + "-"*60)
            print(f"RESULTS:")
            print(f"  Total documents: {len(_corpus)}")
            print(f"  Valid documents: {valid_docs}")
            print(f"  Empty documents: {empty_docs}")
            print(f"  Topic counts: {dict(topic_counts)}")
            print("-"*60)
            
            if valid_docs == 0:
                print("\n⚠️ WARNING: No valid documents found!")
                print("Possible issues:")
                print("  1. text_clean column is empty or malformed")
                print("  2. Tokens parsing failed")
                print("  3. Dictionary doesn't match tokens")
                print("\nPlease run debug_data.py to check your data format")
                
                # Return dummy data to avoid crash
                total_docs = len(_corpus)
                distribution = []
                for topic_id in range(_lda_model.num_topics):
                    distribution.append({
                        'topic_id': topic_id,
                        'posts': 0,
                        'percentage': 0.0
                    })
            else:
                total_docs = valid_docs
                distribution = []
                
                for topic_id in range(_lda_model.num_topics):
                    count = topic_counts.get(topic_id, 0)
                    percentage = (count / total_docs * 100) if total_docs > 0 else 0
                    distribution.append({
                        'topic_id': topic_id,
                        'posts': count,
                        'percentage': round(percentage, 2)
                    })
            
            _topic_stats = {
                'distribution': distribution,
                'total_docs': total_docs,
                'topic_counts': dict(topic_counts),
                'valid_docs': valid_docs,
                'empty_docs': empty_docs
            }
            
            print("\n✓ Topic statistics calculated")
            print("="*60 + "\n")
        
        return _topic_stats
    
    except Exception as e:
        import traceback
        print("\n❌ ERROR in calculate_topic_statistics:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error calculating statistics: {str(e)}")

def clean_keyword(keyword: str) -> str:
    """Clean keyword dari karakter aneh"""
    # Remove quotes, brackets, commas
    cleaned = keyword.strip().strip("'\"[](),")
    return cleaned

def get_gemini_topic_name(keywords: List[str], topic_id: int) -> str:
    """Generate nama topik yang singkat dan jelas menggunakan Gemini AI"""
    try:
        # Bersihkan keywords
        clean_keywords = [clean_keyword(k) for k in keywords if clean_keyword(k)]
        
        if not clean_keywords:
            return f"Topik {topic_id + 1}"
        
        topic_text = ", ".join(clean_keywords[:8])
        
        prompt = f"""Analisis kata kunci berikut dari komentar TikTok tentang Pertalite:

{topic_text}

Buatlah nama topik yang:
- Sangat singkat (2-3 kata)
- Jelas menggambarkan tema pembahasan
- Tanpa tanda baca atau simbol
- Dalam Bahasa Indonesia yang natural

Contoh yang BAIK:
- Harga Terjangkau
- Kualitas Mesin
- Ketersediaan SPBU
- Perbandingan BBM
- Tips Penggunaan

Contoh yang BURUK (jangan seperti ini):
- Tidak & Motor
- Kata & Kata

Berikan HANYA nama topiknya (2-3 kata), tanpa penjelasan atau tanda baca."""

        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        response = model.generate_content(prompt)
        
        result = response.text.strip()
        
        # Bersihkan dari karakter yang tidak diinginkan
        for bad_char in ["'", '"', "`", "*", "**", "\n", "[", "]", "(", ")"]:
            result = result.replace(bad_char, "")
        
        # Hilangkan spasi berlebih
        result = " ".join(result.split())
        
        # Jika terlalu panjang, potong
        words = result.split()
        if len(words) > 4:
            result = " ".join(words[:4])
        
        return result if result else f"Topik {topic_id + 1}"
    
    except Exception as e:
        print(f"Gemini error: {e}")
        clean_keywords = [clean_keyword(k) for k in keywords[:2]]
        return " ".join(clean_keywords).title() if clean_keywords else f"Topik {topic_id + 1}"

def get_topic_color(topic_id: int) -> str:
    """Get gradient color untuk topic"""
    colors = [
        "from-purple-500 to-purple-600",
        "from-pink-500 to-pink-600",
        "from-orange-500 to-orange-600",
        "from-yellow-500 to-yellow-600",
        "from-green-500 to-green-600",
        "from-blue-500 to-blue-600",
        "from-red-500 to-red-600",
        "from-indigo-500 to-indigo-600",
    ]
    return colors[topic_id % len(colors)]

def extract_topics_with_names(model, num_words=10):
    """Extract topics dari model dan generate nama menggunakan AI"""
    topics = []
    
    for topic_id in range(model.num_topics):
        # Get top words untuk topic ini
        topic_words = model.show_topic(topic_id, topn=num_words)
        raw_keywords = [word for word, _ in topic_words]
        
        # Clean keywords
        keywords = [clean_keyword(k) for k in raw_keywords]
        
        # Generate nama topik menggunakan Gemini AI
        topic_name = get_gemini_topic_name(keywords, topic_id)
        
        topics.append({
            'id': topic_id,
            'name': topic_name,
            'keywords': keywords
        })
        
        print(f"Topic {topic_id}: {topic_name} | Keywords: {', '.join(keywords[:5])}")
    
    return topics

# ============ API Endpoints ============

@router.get("/topics", response_model=TopicModelingResponse)
async def get_all_topics():
    """Get semua topics dengan AI interpretation dan statistik real"""
    try:
        print("\n" + "="*60)
        print("FETCHING TOPICS WITH AI INTERPRETATION")
        print("="*60)
        
        model, dictionary, metadata = load_model()
        stats = calculate_topic_statistics()
        
        # Extract topics dengan AI-generated names
        topics_data = extract_topics_with_names(model, num_words=10)
        
        topics = []
        distribution = []
        
        for topic_data in topics_data:
            topic_id = topic_data['id']
            topic_stat = stats['distribution'][topic_id]
            
            topics.append({
                'id': topic_id + 1,  # 1-indexed untuk frontend
                'name': topic_data['name'],  # Nama dari AI
                'keywords': topic_data['keywords'][:6],
                'posts': topic_stat['posts'],
                'percentage': topic_stat['percentage'],
                'color': get_topic_color(topic_id)
            })
            
            distribution.append({
                'topic': topic_data['name'],  # Nama dari AI
                'value': topic_stat['percentage']
            })
        
        print(f"\n✓ Successfully prepared {len(topics)} topics")
        print("="*60 + "\n")
        
        return {
            'topics': topics,
            'distribution': distribution,
            'total_documents': stats['total_docs'],
            'model_info': {
                'model_name': metadata.get('model_name', 'LDA (Optimized)') if metadata else 'LDA (Optimized)',
                'num_topics': model.num_topics,
                'coherence': metadata.get('coherence_score', 0.0) if metadata else 0.0
            }
        }
    
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/info")
async def get_model_info():
    """Get model information dan metadata"""
    try:
        model, dictionary, metadata = load_model()
        df = load_data()
        
        return JSONResponse({
            "status": "success",
            "model_type": metadata.get("model_type", "LDA") if metadata else "LDA",
            "model_name": metadata.get("model_name", "LDA (Optimized)") if metadata else "LDA (Optimized)",
            "num_topics": model.num_topics,
            "vocabulary_size": len(dictionary),
            "coherence_score": metadata.get("coherence_score", 0.0) if metadata else 0.0,
            "diversity_score": metadata.get("diversity_score", 0.0) if metadata else 0.0,
            "total_documents": len(df)
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Check if model is loaded dan ready"""
    try:
        model, dictionary, metadata = load_model()
        df = load_data()
        
        return JSONResponse({
            'status': 'healthy',
            'model_loaded': model is not None,
            'dictionary_loaded': dictionary is not None,
            'metadata_loaded': metadata is not None,
            'data_loaded': df is not None,
            'num_topics': model.num_topics if model else 0,
            'total_documents': len(df) if df is not None else 0
        })
    
    except Exception as e:
        return JSONResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status_code=503)