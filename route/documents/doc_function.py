from langchain.document_loaders import TextLoader, PyPDFLoader, UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter, CharacterTextSplitter
from langchain.embeddings import CacheBackedEmbeddings, OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.prompts import SystemMessagePromptTemplate, AIMessagePromptTemplate, HumanMessagePromptTemplate

from dotenv import load_dotenv
import os

from langchain.chat_models import ChatOpenAI
import openai


load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai.api_key = OPENAI_API_KEY

llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    temperature=0.1,
)


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


# 파일 저장하기  
import uuid
def save_file(file):
    file_name = file.filename + str(uuid.uuid4())
    file_content = file.file.read()

    file_path = f"upload/{file_name}"
    with open(file_path, 'wb') as file:
        file.write(file_content) 

    return file_path


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


def query_retriever(file_path, file_name, question):
    
    print("\n+-------------Make Embedding Start----------------+")
    
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=3000,
        chunk_overlap=100,
    )
    
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load_and_split(text_splitter=splitter)
    embeddings = OpenAIEmbeddings()

    print("\n+----------------Conn ChromaDB--------------------+")
    db = conn_chromadb(docs, embeddings)

    retriever = db.as_retriever()
    results = retriever.get_relevant_documents(question)

    # context = ''
    # for text in results:
    #     context += '\n\n' + text.page_content
        
    prompt = chat_prompt.format_prompt(
        context=results[2].page_content,
        question=question
    ).to_messages()

    answer = llm(prompt)

    return answer.content















