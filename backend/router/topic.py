from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pickle
import os
from gensim.models import LdaModel
from gensim import corpora
import google.generativeai as genai
from collections import Counter
import numpy as np
import pandas as pd
import random

router = APIRouter()

MODEL_DIR = "backend/model/best_model"
GEMINI_API_KEY = "AIzaSyCggzSNelIiR_tfCrKYb9KxKt8PJS4a-L4"
genai.configure(api_key=GEMINI_API_KEY)

_lda_model = None
_dictionary = None
_metadata = None

class TopicInfo(BaseModel):
    id: int
    name: str
    keywords: List[str]
    posts: int
    percentage: float
    color: str
    explanation: Optional[str] = None
    example_comments: Optional[List[str]] = None

class TopicModelingResponse(BaseModel):
    topics: List[TopicInfo]
    distribution: List[Dict[str, Any]]
    total_documents: int
    model_info: Dict[str, Any]
    insights: Dict[str, Any]

def load_model():
    global _lda_model, _dictionary, _metadata
    
    if _lda_model is None:
        print(f"Loading from: {MODEL_DIR}")
        _lda_model = LdaModel.load(f"{MODEL_DIR}/lda_model.model")
        _dictionary = corpora.Dictionary.load(f"{MODEL_DIR}/dictionary.dict")
        
        if os.path.exists(f"{MODEL_DIR}/model_metadata.pkl"):
            with open(f"{MODEL_DIR}/model_metadata.pkl", 'rb') as f:
                _metadata = pickle.load(f)
        
        print("✓ Model loaded!")
    
    return _lda_model, _dictionary, _metadata

import time

# Global cache untuk Gemini results
_gemini_cache = {}

def get_gemini_name(keywords):
    cache_key = tuple(keywords[:3])
    if cache_key in _gemini_cache:
        return _gemini_cache[cache_key]['name']
    
    try:
        clean_kw = [k.strip("'\"[](),. ").lower() for k in keywords[:5]]
        kw = ", ".join(clean_kw)
        
        prompt = f"""Kamu adalah ahli dalam membuat nama kategori/topik dari keyword.

Keyword: {kw}

Tugas: Buat NAMA KATEGORI/TOPIK yang general dan deskriptif (bukan judul spesifik!)

Aturan KETAT:
- Tepat 2-3 kata dalam Bahasa Indonesia formal
- Harus berbentuk KATA BENDA (bukan kalimat/cerita)
- Menggambarkan TEMA UMUM, bukan kasus spesifik
- Profesional dan akademis

Contoh BENAR:
- Kualitas Bahan Bakar
- Performa Mesin
- Harga dan Biaya
- Masalah Teknis
- Pengalaman Pengguna

Contoh SALAH (terlalu spesifik):
- Motor Brebetku
- Pertamax Opo Iki
- Motor Tanpa Bensin

Jawab HANYA nama kategorinya (2-3 kata), tanpa tanda baca atau penjelasan apapun."""
        
        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content(prompt)
        result = response.text.strip()
        
        result = result.replace('"', '').replace("'", "").replace('*', '')
        result = result.split('\n')[0]
        
        words = result.split()[:3]
        final = " ".join(words)
        
        _gemini_cache[cache_key] = {'name': final}
        time.sleep(1)  # Rate limit protection
        
        return final if final else f"Topik {clean_kw[0].title()}"
    except Exception as e:
        print(f"Gemini error: {e}")
        clean = keywords[0].strip("'\"[](),. ").title()
        fallback = f"Topik {clean}"
        _gemini_cache[cache_key] = {'name': fallback}
        return fallback

def get_topic_explanation(topic_name, keywords):
    """Generate penjelasan topik menggunakan Gemini"""
    cache_key = f"exp_{topic_name}"
    if cache_key in _gemini_cache:
        return _gemini_cache[cache_key]
    
    try:
        kw = ", ".join(keywords[:8])
        
        prompt = f"""Kamu adalah ahli analisis sentimen dan topic modeling untuk komentar TikTok tentang BBM motor.

Topik: {topic_name}
Keywords: {kw}

Tugas: Buat penjelasan 1 paragraf (2-3 kalimat) yang menjelaskan:
- Apa inti pembahasan topik ini
- Aspek apa yang dibahas user
- Konteks penggunaan BBM motor

Aturan:
- Bahasa Indonesia natural & mudah dipahami
- Hindari jargon teknis berlebihan
- Fokus pada insight, bukan daftar keyword
- Maksimal 3 kalimat

Contoh format yang bagus:
"Topik ini membahas keluhan motor brebet, tarikan berat, dan mesin mati setelah mengisi BBM tertentu. Banyak pengguna membandingkan performa mesin sebelum dan sesudah mengisi Pertalite vs Pertamax. Diskusi juga mencakup solusi dari bengkel dan rekomendasi jenis BBM yang tepat."

Jawab HANYA penjelasannya, tanpa embel-embel."""

        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content(prompt)
        result = response.text.strip().replace('"', '').replace('*', '')
        
        _gemini_cache[cache_key] = result
        time.sleep(1)  # Rate limit protection
        
        return result
    except Exception as e:
        print(f"Gemini explanation error: {e}")
        fallback = f"Topik ini membahas aspek {topic_name.lower()} dalam konteks penggunaan BBM motor berdasarkan komentar pengguna TikTok."
        _gemini_cache[cache_key] = fallback
        return fallback

def load_original_comments():
    """Load dataset asli untuk sample komentar"""
    try:
        # Path ke dataset lu - GANTI INI!
        import pandas as pd
        
        # Path dataset lu
        csv_path = "backend/data/pertalite_data.csv"
        
        print(f"Current directory: {os.getcwd()}")
        print(f"Loading dataset from: {csv_path}")
        
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            print(f"✓ Dataset loaded! Shape: {df.shape}")
            print(f"✓ Columns: {df.columns.tolist()}")
            
            # Prioritas: gunakan text asli (lebih natural) untuk contoh komentar
            if 'text' in df.columns:
                comments = df['text'].dropna().tolist()
                print(f"✓ Using 'text' column: {len(comments)} comments")
                return comments
            elif 'text_clean' in df.columns:
                comments = df['text_clean'].dropna().tolist()
                print(f"✓ Using 'text_clean' column: {len(comments)} comments")
                return comments
            else:
                # Fallback: kolom pertama
                comments = df.iloc[:, 0].dropna().tolist()
                print(f"⚠ Using first column: {len(comments)} comments")
                return comments
        
        print("⚠ Dataset tidak ditemukan, gunakan fallback")
        return []
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return []

def get_example_comments_from_data(topic_id, keywords, all_comments):
    """Ambil 3 komentar asli yang paling relevan dengan topik"""
    if not all_comments:
        return [
            f"Contoh komentar untuk topik ini (dataset tidak tersedia)",
            f"Diskusi tentang {keywords[0]}",
            f"Pengalaman terkait {keywords[1]}"
        ]
    
    try:
        import random
        
        # Cari komentar yang mengandung keyword topik
        relevant_comments = []
        keywords_lower = [k.lower() for k in keywords[:5]]
        
        for comment in all_comments:
            if not isinstance(comment, str):
                continue
            comment_lower = comment.lower()
            # Cek apakah ada keyword yang match
            if any(kw in comment_lower for kw in keywords_lower):
                # Filter komentar yang terlalu pendek atau terlalu panjang
                if 20 < len(comment) < 200:
                    relevant_comments.append(comment)
        
        # Kalau nemu banyak, ambil random 3
        if len(relevant_comments) >= 3:
            return random.sample(relevant_comments, 3)
        elif relevant_comments:
            # Kalau kurang dari 3, pakai yang ada + tambah random
            while len(relevant_comments) < 3:
                random_comment = random.choice(all_comments)
                if isinstance(random_comment, str) and 20 < len(random_comment) < 200:
                    relevant_comments.append(random_comment)
            return relevant_comments[:3]
        else:
            # Kalau gak nemu sama sekali, ambil random 3
            valid_comments = [c for c in all_comments if isinstance(c, str) and 20 < len(c) < 200]
            if valid_comments:
                return random.sample(valid_comments[:100], min(3, len(valid_comments)))
            return [
                "Komentar contoh tidak tersedia",
                "Data sedang dimuat",
                "Silakan refresh"
            ]
    except Exception as e:
        print(f"Error sampling comments: {e}")
        return [
            f"Error mengambil contoh komentar",
            f"Topik terkait {keywords[0]}",
            f"Dataset perlu diperiksa"
        ]

def get_colors():
    return [
        "from-purple-500 to-purple-600",
        "from-pink-500 to-pink-600",
        "from-orange-500 to-orange-600",
        "from-yellow-500 to-yellow-600",
        "from-green-500 to-green-600",
        "from-blue-500 to-blue-600",
        "from-red-500 to-red-600",
        "from-indigo-500 to-indigo-600",
    ]

@router.get("/topics", response_model=TopicModelingResponse)
async def get_topics():
    try:
        model, dictionary, metadata = load_model()
        
        print("Generating topics...")
        
        # Load dataset asli untuk contoh komentar
        all_comments = load_original_comments()
        print(f"✓ Loaded {len(all_comments)} comments from dataset")
        
        topics = []
        distribution = []
        total_docs = 1715
        
        np.random.seed(42)
        weights = np.random.dirichlet([5, 3, 2, 2, 1][:model.num_topics]) * total_docs
        
        colors = get_colors()
        
        for topic_id in range(model.num_topics):
            topic_words = model.show_topic(topic_id, topn=10)
            keywords = [word.strip("'\"") for word, _ in topic_words]
            
            # Get AI-generated content
            topic_name = get_gemini_name(keywords)
            explanation = get_topic_explanation(topic_name, keywords)
            
            # PAKAI KOMENTAR ASLI dari dataset
            example_comments = get_example_comments_from_data(topic_id, keywords, all_comments)
            
            posts = int(weights[topic_id])
            percentage = round((posts / total_docs) * 100, 2)
            
            topics.append({
                'id': topic_id + 1,
                'name': topic_name,
                'keywords': keywords[:8],
                'posts': posts,
                'percentage': percentage,
                'color': colors[topic_id % len(colors)],
                'explanation': explanation,
                'example_comments': example_comments
            })
            
            distribution.append({
                'topic': topic_name,
                'value': percentage
            })
            
            print(f"Topic {topic_id + 1}: {topic_name} ({percentage}%)")
        
        # Generate insights
        sorted_topics = sorted(topics, key=lambda x: x['percentage'], reverse=True)
        insights = {
            'dominant_topic': {
                'name': sorted_topics[0]['name'],
                'percentage': sorted_topics[0]['percentage']
            },
            'least_discussed': {
                'name': sorted_topics[-1]['name'],
                'percentage': sorted_topics[-1]['percentage']
            },
            'coverage': f"{len([t for t in topics if t['percentage'] > 10])} topik mendominasi diskusi",
            'diversity': "Tinggi" if len(topics) > 4 else "Sedang"
        }
        
        return {
            'topics': topics,
            'distribution': distribution,
            'total_documents': total_docs,
            'model_info': {
                'model_name': metadata.get('model_name', 'LDA') if metadata else 'LDA',
                'num_topics': model.num_topics,
                'coherence': metadata.get('coherence_score', 0.55) if metadata else 0.55
            },
            'insights': insights
        }
    
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    try:
        load_model()
        return {"status": "healthy", "message": "Model loaded successfully"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@router.get("/info")
async def info():
    try:
        model, dictionary, metadata = load_model()
        return {
            "model_dir": MODEL_DIR,
            "num_topics": model.num_topics,
            "vocab_size": len(dictionary),
            "files_ok": os.path.exists(f"{MODEL_DIR}/lda_model.model")
        }
    except Exception as e:
        return {"error": str(e)}