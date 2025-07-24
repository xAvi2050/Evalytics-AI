from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
import os
import bcrypt
import re

# Load environment variables
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGODB_URI")
PORT = int(os.getenv("PORT", 5000))

if not MONGO_URI:
    raise RuntimeError("MONGODB_URI not set in .env")

# Initialize app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
client = AsyncIOMotorClient(MONGO_URI)
db = client["evalytics-ai"]
users_collection = db["users"]

# Pydantic models
class SignupModel(BaseModel):
    firstName: str = Field(min_length=2)
    lastName: str = Field(min_length=2)
    email: EmailStr
    phoneNumber: str
    username: str = Field(min_length=5, max_length=15, pattern="^[a-zA-Z0-9]+$")
    password: str

class LoginModel(BaseModel):
    username: str
    password: str

# Validators
def validate_password(password: str) -> bool:
    return (
        len(password) >= 8
        and re.search(r"[A-Za-z]", password)
        and re.search(r"\d", password)
        and re.search(r"[@$!%*?&]", password)
    )

def validate_phone(phone: str) -> bool:
    return re.fullmatch(r"\+\d{1,3}\d{10}", phone) is not None

# Error handler for validation
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": "Validation error", "details": exc.errors()},
    )

# Root
@app.get("/")
async def root():
    return {"message": "Evalytics-AI Backend API is running!"}

@app.get("/api")
async def api_info():
    return {"message": "Welcome to the Evalytics-AI API. Use /api/signup and /api/login"}

# Signup
@app.post("/api/signup")
async def signup(user: SignupModel):
    if not validate_phone(user.phoneNumber):
        raise HTTPException(status_code=400, detail="Phone number must be in format +<countrycode><10-digit> (e.g. +911234567890)")
    if not validate_password(user.password):
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long, with a letter, digit, and special character.")

    # Uniqueness checks
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken.")
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    if await users_collection.find_one({"phoneNumber": user.phoneNumber}):
        raise HTTPException(status_code=400, detail="Phone number already registered.")

    # Hash password
    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user_doc = user.dict()
    user_doc["password"] = hashed_pw
    user_doc["createdAt"] = datetime.utcnow()

    await users_collection.insert_one(user_doc)

    return {"success": True, "message": "Registration successful! Please login."}

# Login
@app.post("/api/login")
async def login(login_data: LoginModel):
    print(f"Login requested for: {login_data.username}")
    user = await users_collection.find_one({"username": login_data.username})

    if not user:
        print("No such user found.")
        raise HTTPException(status_code=400, detail="Invalid username or password.")

    if not bcrypt.checkpw(login_data.password.encode("utf-8"), user["password"].encode("utf-8")):
        print("Password does not match.")
        raise HTTPException(status_code=400, detail="Invalid username or password.")

    return {
        "success": True,
        "message": "Login successful!",
        "user": {
            "username": user["username"],
            "firstName": user["firstName"],
            "lastName": user["lastName"],
            "email": user["email"],
            "phoneNumber": user["phoneNumber"]
        }
    }
