# uvicorn backend.server:app --reload --port 5000

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, exams, practice, tests
from backend.database import db

app = FastAPI(title="Evalytics-AI Backend")

# --------------------------
# CORS Middleware
# --------------------------
# Allows frontend at localhost:5173 to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

# --------------------------
# Include Routers
# --------------------------
# Each router has its own prefix, e.g., exams.router -> /api/exams
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(practice.router)
app.include_router(tests.router)

# --------------------------
# Startup / Shutdown Events
# --------------------------
@app.on_event("startup")
async def startup_db_client():
    print("FastAPI application starting up...")
    # Example: Seed exams if collection is empty
    if await db["exams"].count_documents({}) == 0:
        print("Seeding exams...")  # Add seed logic here if needed

@app.on_event("shutdown")
async def shutdown_db_client():
    print("FastAPI application shutting down...")

# --------------------------
# Root Endpoint
# --------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to Evalytics-AI Backend"}
