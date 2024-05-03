import pymongo

from dotenv import load_dotenv
import os

# .env 파일 불러오기
load_dotenv()

#------------------------------------------------#
#    
#                MONGO_DB Connection 
#    
#------------------------------------------------#
MONGO_DB_USER_NAME = os.getenv('MONGO_DB_USER_NAME')
MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')

uri = f"mongodb+srv://{MONGO_DB_USER_NAME}:{MONGO_DB_PASSWORD}@{MONGO_DB_NAME}.j8hfetc.mongodb.net/"

client = pymongo.MongoClient(uri)
db = client.embedding
collection = db.vector

def get_db():
    yield db


#------------------------------------------------#
#    
#                Redis Connection 
#    
#------------------------------------------------#
import redis

REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

redis = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    # decode_responses=True
)

print("->>>> redis connection ->>>>: ", redis)
