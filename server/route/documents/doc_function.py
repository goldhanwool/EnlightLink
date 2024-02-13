from fastapi import HTTPException
from langchain.document_loaders import TextLoader, PyPDFLoader, UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter, CharacterTextSplitter
from langchain.schema import BaseOutputParser
from langchain.embeddings import CacheBackedEmbeddings, OpenAIEmbeddings
from langchain.storage import LocalFileStore
from langchain.vectorstores import Chroma
from langchain.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.prompts import SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate

from dotenv import load_dotenv
import os

from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain_community.llms import OpenAI
from langchain.callbacks import StreamingStdOutCallbackHandler
from langchain.vectorstores import FAISS
import openai
from transformers import GPT2Tokenizer
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI

from langchain.memory import ConversationBufferMemory
from transformers import BertTokenizer
from main import AdvancedConversationBufferMemory
from db import redis
import uuid
import pickle

# .env 파일 불러오기
load_dotenv()

# 예를 들어, .env 파일에 있는 환경 변수를 사용하기
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai.api_key = OPENAI_API_KEY

llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    temperature=0.1,
    max_tokens=500,
    # callback=[
    #     StreamingStdOutCallbackHandler(),
    # ]
)

"""
loader.load_and_split(text_splitter=splitter)의 데이터 구조 -> list[dict, dict, ...]

    [
        Document(
            page_content='Scaled\nDot-Product Attention Multi-Head Attention\nFigure 2: (left) Scaled Dot-Product Attention. (right) Multi-Head Attention consists of several attention layers running in parallel.\nof the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.\n3.2.1 Scaled Dot-Product Attention', 
            metadata={'source': './test/black_image.jpg'}),             
        Document(
            page_content='3.2.1 Scaled Dot-Product Attention\nWe call our particular attention "Scaled Dot-Product Attention" (Figure 2). The input consists queries and keys of dimension d,, and values of dimension d,. We compute the dot products of the query with all keys, divide each by /d,, and apply a softmax function to obtain the weights on the values.\npractice, we compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed together into matrices K and V. We compute matrix of outputs as:\nIn\nthe\nAttention(Q, K, V) = softmax( a)', 
            metadata={'source': './test/black_image.jpg'}
            ), 
    ...
    ]
"""

template = ChatPromptTemplate.from_messages([ # if not list [] -> TypeError: from_messages() takes 2 positional arguments but 3 were given
    (
        "system",
        """
        You are an assistant with a Ph.D. Answer the question using only Korea language. 
        Please refer to the previous message and reply.
        If you don't know the answer,
        just say you don' know. DON'T make anything up.

        Previous  Message: {previous_message} 
        Context: {context}
        """,
    ),
    ("human", "{question}"),
])


system_template = """
You are a world-renowned konean scholar in artificial intelligence and a professor specializing in AI. Based on the given text, please explain the answer to the question.
Please refer to the previous message and reply.
Generate an answer to the question based on the given text.
Generate an answer to the question based on general knowledge, not the given text.
Please answer in these two ways.

    Previous  Message: {previous_message} 
    Context: {context}

if answer english, translate it to korea language

"""

human_template = """
{question}

"""

system_message_prompt = SystemMessagePromptTemplate.from_template(
    system_template
)

human_message_prompt = HumanMessagePromptTemplate.from_template(
    human_template
)

chat_prompt = ChatPromptTemplate.from_messages([
    system_message_prompt,
    human_message_prompt
])

openai_embeddings = OpenAIEmbeddings()


def set_chromadb(file_path):
    print("\n+-------------Conn ChromaDB----------------+")
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=3000,
        chunk_overlap=100,
    )
    
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load_and_split(text_splitter=splitter)

    table_name = str(uuid.uuid1())
    embedding_path = f'./db_table/{table_name}'

    Chroma.from_documents(
        docs,
        openai_embeddings,
        persist_directory=embedding_path
    )

    vectordb_path = embedding_path
    return vectordb_path


# 파일 저장하기  
import uuid
def save_file(file):
    print('+-------[save_file]-------+')

    file_name = file.filename + str(uuid.uuid4())
    file_content = file.file.read()

    file_path = f"upload/{file_name}"
    with open(file_path, 'wb') as file:
        file.write(file_content) 

    return file_path

client = OpenAI()


def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.Embeddings.create(input = [text], model=model).data[0].embedding


def format_docs(docs):
    print("\n+-------------format_docs Start----------------+")
    doc_ls = []
    doc = ""
    for document in docs:
        if not document.page_content:
            continue
        doc += "\n\n" + document.page_content
        #doc_ls.append(document.page_content)
    
    return doc
    #return doc_ls


def conn_chromadb(docs, embeddings):
    table_name = uuid.uuid1()
    embedding_path = f'./db_table/{table_name}'

    db = Chroma.from_documents(
        docs,
        embeddings,
        persist_directory=embedding_path
    )

    db_connection = Chroma(
        persist_directory= embedding_path,
        embedding_function=embeddings
    )

    return db_connection, embedding_path


def make_embedding(file_path):
    print("\n+-------------Make Embedding Start----------------+")
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=3000,
        chunk_overlap=100,
    )
    
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load_and_split(text_splitter=splitter)
    embeddings = OpenAIEmbeddings()

    print("\n+-------------Conn ChromaDB----------------+")
    chroma_db, embedding_path = conn_chromadb(docs, embeddings)

    return chroma_db, embedding_path


def get_redis_memory_obj(session_id):
    serialized_conversation = redis.get(session_id)
    if not serialized_conversation:
        raise HTTPException(status_code=404, detail="Session not found")
    print("\n+-------------get_conversation_obj_from_redis----------------+")
    conversation_obj = pickle.loads(serialized_conversation)

    #memory_obj = AdvancedConversationBufferMemory.deserialize(conversation.chat_memory.messages)
    print(conversation_obj)
    return conversation_obj


def question_embedding(question, session_id, db):
    print("\n+-------------Question Embedding Start----------------+")
    retriever = db.as_retriever()
    
    print("\n+-------------doc-question retriever----------------+")
    # 문서
    results = retriever.get_relevant_documents(question)
    context = ''
    for text in results:
        context += '\n\n' + text.page_content

    # 전체 토큰 확인 및 제한
    print("\n+-------------previous message----------------+")
    memory = get_redis_memory_obj(session_id) #memory 객체 반환
    message_token_cnt = get_token(question)

    #GPT에 보내기 전 해당 토큰의 개수를 확인 제한 -> 메모리 할당된 chat 토큰 수 확인
    memory.calculate_token(len(memory.buffer), message_token_cnt, memory)

    # 메모리 토큰 가져오기. 
    previous_message = ''
    for msg_obj in memory.chat_memory.messages:
        previous_message += '\n' + msg_obj.content

    prompt = chat_prompt.format_prompt(
        previous_message=str(previous_message),
        context=context,
        question=question
    ).to_messages()

    answer = llm(prompt)

    print("\n+-------------save_answer_memory----------------+")
    # 전체 토큰 확인 및 ai 답변 저장
    human_input = {
        "content": question,
    }
    ai_input = {
        "content": answer.content,
    }

    #상속받은 class BaseChatMemory 함수 사용
    memory.save_context(human_input, ai_input)

    #레디스 저장
    serialized_conversation = pickle.dumps(memory)
    redis.set(session_id, serialized_conversation, ex=3600)

    return {
        'answer': answer.content
    }


def get_token(text):
    from transformers import BertTokenizer

    # BERT 모델을 위한 토크나이저 로드
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

    # 토크나이저를 사용하여 텍스트를 토큰화하고 토큰 수를 계산
    message_token_cnt = tokenizer(text)
    return len(message_token_cnt)


def embedding_mongodb(file_path, file_name, question):
    # print("\n+-------------make_embedding Start----------------+")
    file_id = uuid.uuid1().__str__()
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=3000,
        chunk_overlap=100,
    )

    loader = UnstructuredFileLoader(file_path)
    docs = loader.load_and_split(text_splitter=splitter)


    """
    data.__dict__

        {
            'page_content': '...text.....', 
            'metadata': 
                {
                    'source': 'upload/Screenshot from 2024-02-07 11-58-53.pngd8b81efc-4298-4762-ac52-275330a47ea3'
                }, 
            'type': 'Document'
        }
    
    """
    # #https://python.langchain.com/docs/integrations/text_embedding/openai
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    
    cnt = 0
    embedding_ls = []
    for doc in docs:
        cnt += 1
        db_data = {}

        db_data["embedding"] = embeddings.embed_documents([doc.page_content])
        db_data["text"] = doc.page_content
        db_data["metadata"] = doc.metadata
        db_data["type"] = doc.type
        db_data["page"] = cnt
        db_data["file_id"] = file_id

        embedding_ls.append(db_data)

    print("\n+-------------embedding_ls----------------+")

    return embedding_ls, file_id

def mongodb_search_doc(doc):
    
    from sentence_transformers import SentenceTransformer, util
    import numpy as np

    # 모델 초기화 (여기서는 범용적으로 사용되는 'all-MiniLM-L6-v2' 모델을 사용합니다)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    query = "what is react mean?"
    
    #텍스트와 질문 임베딩 생성
    #HuggingFace에서 제공하는 모델을 사용하여 문장을 벡터로 변환
    question_embedding = model.encode(query)

    from db import collection

    results = collection.aggregate([
        {
            "$vectorSearch": {
                "queryVector": question_embedding,
                "path": "embeddings",
                "numCandidates": 100,
                "limit": 4,
                "index": "default"
            }
        }
    ]);
    print("\n+-------------results----------------+")
    for i in results:
        print("\ni:", i)

    return results








