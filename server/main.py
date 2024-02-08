from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from db import get_db, collection
from dotenv import load_dotenv
import os

from bson import ObjectId  # For ObjectId to be JSON serializable
from pydantic import BaseModel


app = FastAPI()
origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_key = os.getenv('OPENAI_API_KEY')


@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/get_data")
def get_data(db=Depends(get_db)):
    ## MongoDB에서 데이터 조회
    document = collection.find_one({"title": "테스트"})
    print(document)
    import json
    return str(document)


@app.get("/get_datas")
def get_datas(db=Depends(get_db)):
    #만약 특정 조건에 맞는 여러 문서를 가져오고 싶다면, find() 메소드에 쿼리를 전달할 수 있습니다. 예를 들어, 특정 조건을 만족하는 문서들을 찾으려면 다음과 같이 할 수 있습니다:
    items = []
    #collection.find() -> 모든 데이터 조회
    for item in collection.find({"title": "테스트"}): 
         items.append(item)
    print(items)
    return str(items)


class InsertResponseModel(BaseModel):
    inserted_id: str

@app.post("/post_data")
def get_datas(data: str, db=Depends(get_db)):
    insert_db = db["vector"].insert_one({"title": data}) #data.dict() -> dict 형태로 변환
    return InsertResponseModel(inserted_id=str(insert_db.inserted_id))


from route.documents import doc_router
app.include_router(doc_router.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


