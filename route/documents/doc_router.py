from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body
from . import doc_crud, doc_schema
# from model import Vectors
from db import get_db
from pydantic import BaseModel, Field
from typing import List
from . import doc_crud, doc_schema, doc_function

router = APIRouter(
    tags=["LLM"],
    prefix="/api/llm",
)

@router.post("/upload")
def upload(
    question: str = Body(..., title="질의", example="What is the capital of France?"), 
    file: UploadFile = File(..., title="파일"),
    db=Depends(get_db)) -> str:    
    
    file_path = doc_function.save_file(file)
    return doc_function.query_retriever(file_path, file.filename, question)





