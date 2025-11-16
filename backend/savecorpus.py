import os
import pickle

MODEL_DIR = "backend/model/best_model"

print("="*60)
print("CHECKING MODEL DIRECTORY")
print("="*60)

if not os.path.exists(MODEL_DIR):
    print(f"❌ Directory not found: {MODEL_DIR}")
else:
    print(f"✓ Directory exists: {MODEL_DIR}")
    print("\nFiles in directory:")
    
    all_files = []
    for root, dirs, files in os.walk(MODEL_DIR):
        for file in files:
            filepath = os.path.join(root, file)
            size = os.path.getsize(filepath)
            all_files.append((filepath, size))
    
    # Sort by size
    all_files.sort(key=lambda x: x[1], reverse=True)
    
    for filepath, size in all_files:
        size_mb = size / (1024 * 1024)
        print(f"  {filepath}")
        print(f"    Size: {size_mb:.2f} MB")

print("\n" + "="*60)
print("CHECKING REQUIRED FILES")
print("="*60)

required_files = {
    'lda_model.model': f"{MODEL_DIR}/lda_model.model",
    'dictionary.dict': f"{MODEL_DIR}/dictionary.dict",
    'model_metadata.pkl': f"{MODEL_DIR}/model_metadata.pkl",
    'corpus.pkl': f"{MODEL_DIR}/corpus.pkl",  # Corpus yang dipakai training
    'doc_topics.pkl': f"{MODEL_DIR}/doc_topics.pkl",  # Topic assignments
}

for name, path in required_files.items():
    if os.path.exists(path):
        size = os.path.getsize(path) / (1024 * 1024)
        print(f"✓ {name:25s} ({size:.2f} MB)")
    else:
        print(f"❌ {name:25s} NOT FOUND")

print("\n" + "="*60)
print("CHECKING METADATA")
print("="*60)

metadata_path = f"{MODEL_DIR}/model_metadata.pkl"
if os.path.exists(metadata_path):
    try:
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
        
        print("Metadata contents:")
        for key, value in metadata.items():
            print(f"  {key}: {value}")
    except Exception as e:
        print(f"❌ Error reading metadata: {e}")
else:
    print("❌ Metadata file not found")

print("\n" + "="*60)
print("SUGGESTIONS")
print("="*60)

corpus_exists = os.path.exists(f"{MODEL_DIR}/corpus.pkl")
doc_topics_exists = os.path.exists(f"{MODEL_DIR}/doc_topics.pkl")

if corpus_exists and doc_topics_exists:
    print("✓ Perfect! You have corpus and doc_topics files")
    print("  Backend can load these directly")
elif corpus_exists:
    print("✓ You have corpus.pkl")
    print("  Backend can calculate topic distribution from this")
else:
    print("❌ No corpus.pkl found")
    print("\nYou need to:")
    print("  1. Save corpus during training:")
    print("     with open('corpus.pkl', 'wb') as f:")
    print("         pickle.dump(corpus, f)")
    print()
    print("  2. OR save topic assignments during training:")
    print("     doc_topics = [model.get_document_topics(doc) for doc in corpus]")
    print("     with open('doc_topics.pkl', 'wb') as f:")
    print("         pickle.dump(doc_topics, f)")