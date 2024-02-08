from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body, Request
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
    print('image_path: ', file_path)

    msg = doc_function.make_embedding(file_path, file.filename, question=question)
    return msg.content.replace('"', '')
    


@router.get("/get_my_ip")
async def get_my_ip(request: Request):
    # X-Forwarded-For 헤더를 우선적으로 확인
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        # X-Forwarded-For 헤더가 존재하면, 첫 번째 IP 주소를 사용자의 IP로 간주
        client_ip = x_forwarded_for.split(",")[0]
    else:
        # X-Forwarded-For 헤더가 없으면 request.client.host를 사용
        client_ip = request.client.host
    return {"Client IP": client_ip}


@router.post("/answer")
def answer(
    question: str = Body(None, title="질의", example="What is the capital of France?"), 
    file_id: str = Body(None, title="파일 ID", example="7e18690c-c5e8-11ee-83ff-18c04d9774fa"),
    db=Depends(get_db)) -> str:    

    #question을 임베딩
    get_ = doc_function.question_embedding(question, file_id, db)
    
    print("\n+-------------question_embedding_obj----------------+")
    print(get_)

    #코사인 유사도가 가장 높은 문서의 내용을 반환 
    
    return get_


@router.post("/uploads")
def upload__(
    question: str = Body(None, title="질의", example="What is the capital of France?"), 
    file: UploadFile = File(..., title="파일"),
    db=Depends(get_db)
    ) -> list:    

    file_path = doc_function.save_file(file)

    embedding_vector_ls, file_id  = doc_function.make_embedding_and_save_mongodb(file_path, file.filename)

    vector_id = []
    for embedding_vector in embedding_vector_ls:
        _id = doc_crud.add_vectors(embedding_vector, file_id, db)
        print("\n+-------------_id----------------+")
        vector_id.append(str(_id.inserted_id))
    
    return vector_id

