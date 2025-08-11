from fastapi import APIRouter, Depends, HTTPException
from typing import List
from bson import ObjectId
from backend import models, utils, database

router = APIRouter(prefix="/api/tests", tags=["Tests"])

@router.get("/", response_model=List[models.TestModel])
async def get_all_tests(current_user: dict = Depends(utils.get_current_user)):
    tests_cursor = database.tests_collection.find()
    tests = await tests_cursor.to_list(100)
    return tests

@router.get("/{test_id}", response_model=models.TestModel)
async def get_test_details(test_id: str, current_user: dict = Depends(utils.get_current_user)):
    if not ObjectId.is_valid(test_id):
        raise HTTPException(status_code=400, detail="Invalid test ID")
    test = await database.tests_collection.find_one({"_id": ObjectId(test_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test