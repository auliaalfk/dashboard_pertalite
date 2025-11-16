from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.router import home, sentiment, emotion, topic


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register router
app.include_router(home.router, prefix="/api/home", tags=["Home"])
app.include_router(emotion.router, prefix="/api/emotion", tags=["Emotion"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(topic.router, prefix="/api/topic", tags=["Topic"])

@app.get("/")
def root():
    return {"message": "Backend is running!"}
