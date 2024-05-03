# RAG(Retrieval Augmented Generation) Project ver02
RAG Chat Service는 NestJS와 GraphQL을 기반으로 하여 사용자의 질문에 대한 답변을 생성하는 대화형 채팅 서비스입니다. 이 서비스는 OpenAI의 ChatGPT 모델을 활용하여 질문에 대한 내용을 검색하고, 그 결과를 바탕으로 사용자에게 정보를 제공합니다. 이 프로젝트는 교육적 목적과 기술 시연을 위해 개발되었습니다.


LLM(ChatGPT) + React + NestJs + Graphql + RestfulAPI + PineCone + MongoDB + Matrial UI

![Alt text](client/static/logic.png)

# Main Fuction

- 파일 업로드 및 벡터화: 사용자로부터 파일을 받아 주어진 PDF 문서를 벡터화하여 저장합니다.
- 데이터 검색: 벡터 저장소에 저장된 파일 내용을 기반으로 검색을 실시합니다.
- 응답 생성: GPT 프롬프트 명령에 따라 모델이 응답을 생성합니다.
- 소켓 통신: GraphQL 소켓 기반 실시간 채팅으로 LLM 모델의 답변을 제공합니다.


## Setting Up Backend - NestJS `.env`

Create a `.env` file in the root directory of your project and include the following lines:

```plaintext
PORT=3001
MODE='dev'
MONGO_URI=''
COLLECTION_NAME=''
JWT_SECRET=''
JWT_EXPIRATION=3600
OPENAI_API_KEY=''
PINECONE_API_KEY=''
AWS_ACCESS_KEY=''
AWS_SECRET_ACCESS_KEY=''
AWS_BUCKET_NAME=''
AWS_REGION=''
```

## Running

node version > 18.13.0
Firefox browser - localhost:3000

- client, server Install
```
 npm install
```

- react client start
```
 npm start
```

- nestJs server start
```
 npm run start:dev
```

