from typing import List
from langchain.vectorstores import Chroma
from langchain.embeddings import CacheBackedEmbeddings, OpenAIEmbeddings


class ChromaDbManager:
    def __init__(self):
        self.embedding_model = OpenAIEmbeddings()
        self.db = None
    
    def get_chromadb(self, path: str):
        self.db = Chroma(
            persist_directory=path,
            embedding_function=self.embedding_model
        )
        return self.db

chromadb = ChromaDbManager()

def add_vectors(data: List[float], db):
    # 텍스트 받아서 벡터화
    print('data: ', data)
    insert_db = db["vectors"].insert_one(data) #data.dict() -> dict 형태로 변환
    return insert_db