import pymongo

from dotenv import load_dotenv
import os

# .env 파일 불러오기
load_dotenv()

MONGO_DB_USER_NAME = os.getenv('MONGO_DB_USER_NAME')
MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')

uri = f"mongodb+srv://{MONGO_DB_USER_NAME}:{MONGO_DB_PASSWORD}@{MONGO_DB_NAME}.j8hfetc.mongodb.net/"
print("DB URL: ", uri)

client = pymongo.MongoClient(uri)
db = client.embedding
collection = db.vector

def get_db():
    yield db