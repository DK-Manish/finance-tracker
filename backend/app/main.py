from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Finance Tracker API",
    description="Personal finance tracker backend",
    version="1.0.0"
)

# This allows your React frontend (on port 5173) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Finance Tracker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}