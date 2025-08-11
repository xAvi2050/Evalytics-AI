from pydantic import BaseModel, EmailStr, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from datetime import datetime
from bson import ObjectId
from typing import List, Optional, Any

# ====================================================================
# Pydantic V2 Custom Type for BSON ObjectId (Corrected)
# ====================================================================
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        """
        Defines the validation and serialization logic for ObjectIds for Pydantic v2.
        - Validation: Tries to convert the input into an ObjectId.
        - Serialization: Converts the ObjectId to a string.
        """
        # Validator function
        def validate(value: Any) -> ObjectId:
            if isinstance(value, ObjectId):
                return value
            if ObjectId.is_valid(str(value)):
                return ObjectId(value)
            raise ValueError("Invalid ObjectId")

        # Define the schema for Python instances
        python_schema = core_schema.chain_schema([
            core_schema.no_info_plain_validator_function(validate),
            core_schema.is_instance_schema(ObjectId)
        ])

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=python_schema,
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )
# ====================================================================

# --- Auth Models ---
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

class UserInDBModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    phoneNumber: str
    createdAt: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- Content Models (Exams, Practice, Tests) ---
class QuestionModel(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    question_type: str
    text: str
    options: Optional[List[str]] = []
    correct_answer: Optional[str] = None
    test_cases: Optional[List[dict]] = []

class ContentModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    questions: List[QuestionModel]

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ExamModel(ContentModel):
    duration_minutes: int

class PracticeModel(ContentModel):
    difficulty: str

class TestModel(ContentModel):
    language: str
    pass_criteria: float

# --- Session & Proctoring Models ---
class ProctoringFlagModel(BaseModel):
    session_id: str
    flag_type: str
    details: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ExamSessionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId 
    exam_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    flags: List[dict] = []
    answers: dict = {}

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SubmissionModel(BaseModel):
    session_id: str
    answers: dict