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

# .env 파일 불러오기
load_dotenv()

# 예를 들어, .env 파일에 있는 환경 변수를 사용하기
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai.api_key = OPENAI_API_KEY

llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    temperature=0.1,
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
        You are an assistant with a Ph.D. Answer the question using only Korea language. If you don't know the answer,
        just say you don' know. DON'T make anything up.

        Context: {context}
        """,
    ),
    ("human", "{question}"),
])


system_template = """
You are a world-renowned konean scholar in artificial intelligence and a professor specializing in AI. Based on the given text, please explain the answer to the question.

Generate an answer to the question based on the given text.
Generate an answer to the question based on general knowledge, not the given text.
Please answer in these two ways.

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

embeddings = OpenAIEmbeddings()

# 파일 저장하기  
import uuid
def save_file(file):
    file_name = file.filename + str(uuid.uuid4())
    file_content = file.file.read()
    print('\n--------------->>> file_name: ', file_name)

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
    db = Chroma.from_documents(
        docs,
        embeddings,
        persist_directory=f'./db_table/{table_name}'
    )

    db_connection = Chroma(
        persist_directory=f"./db_table/{table_name}",
        embedding_function=embeddings
    )
    return db_connection

def make_embedding(file_path, file_name, question):
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
    db = conn_chromadb(docs, embeddings)

    retriever = db.as_retriever()
    results = retriever.get_relevant_documents(question)
    context = ''
    for text in results:
        context += '\n\n' + text.page_content
        
    prompt = chat_prompt.format_prompt(
        context=results[2].page_content,
        question=question
    ).to_messages()

    answer = llm(prompt)
    print("answer: " , answer)
    return answer

import numpy as np
def question_embedding(question, file_id, db):

    #몽고디비에서 조회 벡터들 가져오기

    print("\n+-------------Question Embedding Start----------------+")
    embedding_query = embeddings.embed_query(question)

    items = []
    for item in db[file_id].find(): #몽고디비에서 조회 벡터들 가져오기 
        items.append(item)
    
    #question과 문서들 사이 코사인 유사도 계산. 
    cosine_ls = []
    for cos in items:
        print("\n+-------------cos----------------+")
        print(cos["page"])
        cos_embeding_array = cos["embedding"]
        embedding_query = np.array(embedding_query)

        dot_product = np.dot(cos_embeding_array, embedding_query)

        question_norm = np.linalg.norm(cos_embeding_array)
        document_norm = np.linalg.norm(embedding_query)

        cosine_similarity = dot_product / (question_norm * document_norm)
        cosine_ls.append(cosine_similarity)

    return cosine_ls


def make_embedding_and_save_mongodb(file_path, file_name):

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
    
    return embedding_ls, file_id






