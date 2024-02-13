from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from db import get_db, collection, redis
from dotenv import load_dotenv
import os

from bson import ObjectId  # For ObjectId to be JSON serializable
from pydantic import BaseModel

from langchain.memory import ConversationBufferMemory
import uuid
import pickle
from route.documents import doc_function


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


#------------------------------------------------#
#    
#          Class  ConversationBufferMemory 
#    
#------------------------------------------------#
max_tokens = 4095
#max_tokens = 1000

import json
class AdvancedConversationBufferMemory(ConversationBufferMemory):

    def calculate_token(self, total_tokens, message_token_count, memory):
        msg_cnt = 0
        if total_tokens + message_token_count > max_tokens:
            token_to_remove = total_tokens + message_token_count - max_tokens
                
            msg_str = ''
    
            for i in memory.chat_memory.messages:
                if len(msg_str) < token_to_remove:
                    msg_str += i.content

                else:
                    break
                msg_cnt += 1
    
        if msg_cnt == 0:
            return 0
        else:
            for i in range(msg_cnt):
                # 새로운 리스트에 기존 대화를 저장하고 요약해서 맨 처음 휴먼 메세지 요약과 AI 메세지 요약으로 구성한다. 
                memory.chat_memory.messages.pop(0)   
            return 1
    
    @classmethod
    def deserialize(cls, messages) -> "AdvancedConversationBufferMemory":
        """Generate an AdvancedConversationBufferMemory object."""
        obj = cls()
        if len(messages) == 0:
            return obj
        
        for message in messages:
            message_info = message.__dict__
            if message_info['type'] == 'human':
                obj.chat_memory.add_user_message(message.content)
            else:
                obj.chat_memory.add_ai_message(message.content)

            return obj

#------------------------------------------------#
#    
#           API
#    
#------------------------------------------------#
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


@app.get("/get_redis_data")
def redis_data(key: str):
    serialized_conversation = redis.get(key)
    conversation = pickle.loads(serialized_conversation)
    return conversation


@app.get("/get_redis_keys")
def redis_keys():
    return redis.keys("*")


@app.delete("/redis_key")
def del_redis_key():
    return redis.flushdb()


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


