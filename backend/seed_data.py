# python -m backend.seed_data

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

# --- NEW QUESTION SET WITH CORRECT ANSWERS ---
dummy_exams = [
    {
        "_id": ObjectId(),
        "title": "Python Fundamentals Quiz",
        "duration_minutes": 15,
        "questions": [
            {
                "id": "py_q1",
                "question_type": "mcq",
                "text": "What is the correct way to create a function in Python?",
                "options": ["function myFunction()", "def myFunction():", "create myFunction():"],
                "correct_answer": "def myFunction():"
            },
            {
                "id": "py_q2",
                "question_type": "mcq",
                "text": "Which method can be used to return a string in upper case letters?",
                "options": ["upper()", "toUpperCase()", "uppercase()"],
                "correct_answer": "upper()"
            },
            {
                "id": "py_q3",
                "question_type": "coding",
                "text": "Write a Python function `multiply(a, b)` that returns the product of two numbers.",
                "test_cases": [
                    {"input": "2, 3", "output": "6", "hidden": False},
                    {"input": "5, 5", "output": "25", "hidden": False},
                    {"input": "-10, 10", "output": "-100", "hidden": True},
                    {"input": "0, 100", "output": "0", "hidden": True}
                ]
            }
        ]
    },
    {
        "_id": ObjectId(),
        "title": "Web Development Basics",
        "duration_minutes": 10,
        "questions": [
            {
                "id": "web_q1",
                "question_type": "mcq",
                "text": "What does HTML stand for?",
                "options": ["Hypertext Markup Language", "Hyper-Tool Markup Language", "Home Tool Markup Language"],
                "correct_answer": "Hypertext Markup Language"
            },
            {
                "id": "web_q2",
                "question_type": "mcq",
                "text": "Which CSS property is used to change the text color of an element?",
                "options": ["fgcolor", "color", "text-color"],
                "correct_answer": "color"
            },
            {
                "id": "web_q3",
                "question_type": "coding",
                "text": "Write a Javascript function `greet(name)` that returns the string 'Hello, ' followed by the name.",
                "test_cases": [
                    {"input": "'World'", "output": "'Hello, World'", "hidden": False},
                    {"input": "'Alice'", "output": "'Hello, Alice'", "hidden": False},
                    {"input": "''", "output": "'Hello, '", "hidden": True}
                ]
            }
        ]
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["evalytics-ai"]
    exams_collection = db["exams"]
    
    print("Deleting old exams...")
    await exams_collection.delete_many({})
    
    print("Seeding new exams with correct answers...")
    await exams_collection.insert_many(dummy_exams)
    print("Seeding complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())