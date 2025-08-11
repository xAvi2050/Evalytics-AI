from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, exams, practice, tests
from backend.database import db

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(practice.router)
app.include_router(tests.router)

@app.on_event("startup")
async def startup_db_client():
    # You can add logic here to connect to the DB, if not already done
    # Or to seed data
    print("FastAPI application starting up...")
    # Example of seeding data
    if await db["exams"].count_documents({}) == 0:
        print("Seeding exams...")
        # Add seed data logic here as in your original file

@app.on_event("shutdown")
async def shutdown_db_client():
    print("FastAPI application shutting down...")

@app.get("/")
def read_root():
    return {"message": "Welcome to Evalytics-AI Backend"}