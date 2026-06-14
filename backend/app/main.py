from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user  # noqa: F401
from app.routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Finance Tracker API",
    description="Personal finance tracker backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Finance Tracker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}