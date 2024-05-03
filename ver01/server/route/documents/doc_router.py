from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body, Request
from . import doc_crud, doc_schema
# from model import Vectors
from db import get_mongo_db
from pydantic import BaseModel, Field
from typing import List
from . import doc_crud, doc_schema, doc_function
from main import AdvancedConversationBufferMemory
from db import redis
import uuid
import pickle
import json

router = APIRouter(
    tags=["LLM"],
    prefix="/api/llm",
)

@router.post("/upload")
def upload(
    file: UploadFile = File(..., title="파일"),
    db=Depends(get_mongo_db)
    ):    
    
    file_path = doc_function.save_file(file)
    print('\n[file_path]: ', file_path)

    vectordb_path = doc_function.set_chromadb(file_path)
    if not vectordb_path:
        raise HTTPException(status_code=400, detail="파일 업로드 실패")
    
    memory = AdvancedConversationBufferMemory()
    serialized_conversation = pickle.dumps(memory)

    session_id = str(uuid.uuid1())
    redis.set(session_id, serialized_conversation, ex=3600)
    res = { 
        "session_id": session_id,
        "vectordb_path": vectordb_path 
    }
    return json.dumps(res)


@router.post("/answer")
def answer(
    question: str = Body(None, title="질의", example="What is the capital of France?"), 
    vectordb_path: str = Body(None, title="파일 ID", example="7e18690c-c5e8-11ee-83ff-18c04d9774fa"),
    session_id: str = Body(None, title="세션 ID", example="7e18690c-c5e8-11ee-83ff-18c04d9774fa"),
    db=Depends(get_mongo_db)) -> dict:    

    print('\n***API ENDPOINT*** - [answer] > data: ', question, vectordb_path)
    db = doc_crud.chromadb.get_chromadb(vectordb_path)
    res = doc_function.question_embedding(question, session_id, db)

    return res 

