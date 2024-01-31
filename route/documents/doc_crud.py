from db import get_db
from typing import List

def add_vectors(data: List[float], db):
    # 텍스트 받아서 벡터화
    print('data: ', data)
    insert_db = db["vectors"].insert_one(data) #data.dict() -> dict 형태로 변환
    return insert_db