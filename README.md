# Documant LangChain Project
LLM(ChatGPT) + ChromaDB + FastApi

![Alt text](upload/sample.png)

## Code Discription
업로드된 파일에서 텍스트를 로드하고, 분할한 다음 OpenAI 임베딩을 사용하여 Chroma 벡터 데이터베이스에 저장하고, 사용자의 질문에 맞는 문서를 검색하여 그 내용을 기반으로 langchain과 OpenAI의 GPT 모델을 사용해 대답을 생성합니다.


## Setup
- python version : Python 3.10
- install Library
```
 pip install -r requirements.txt
```
- server start
```
 python main.py
```

