import { Inject, Injectable, forwardRef } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { MessageService } from 'src/chat/message/message.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { ChatOpenAI } from '@langchain/openai';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { ChatRepository } from 'src/chat/chat.repository';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class RagService {
  private readonly openai: OpenAI;
  private readonly pc: Pinecone;
  private model: ChatOpenAI;

  constructor(
    private readonly configService: ConfigService,
    // Circular dependency -> MessageService에서 RagService를 사용하고 있음
    // module을 import해서 상호 같은 service 또는 repository를 사용한다면 순환참조를 해결해야됨
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly chatRepository: ChatRepository,
  ) {
    this.openai = new OpenAI(this.configService.getOrThrow('OPENAI_API_KEY'));
    this.pc = new Pinecone({
      apiKey: this.configService.getOrThrow('PINECONE_API_KEY'),
    });
    this.model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 700,
    });
  }

  async sendMessageAi(chatId: string, content: string) {
    const chatIdInfo = await this.chatRepository.findOne({ _id: chatId });
    const embeddingRes = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content,
    });
    const questionEmbedding = embeddingRes.data[0].embedding;
    const pcIndex = this.pc.index(chatIdInfo.pineconeIndex);
    const namespace = chatIdInfo.pineconeNamespace;
    const queryRes = await pcIndex.namespace(namespace).query({
      vector: questionEmbedding,
      topK: 2,
      includeMetadata: true,
      includeValues: false,
    });

    const relevanceInfo = queryRes.matches[0].metadata; // 가장 유사한 문장의 메타데이터

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Answer the question based only on the following context: {context}',
      ],
      ['human', 'question: {question}'],
    ]);

    const chain = prompt.pipe(this.model);
    const response = await chain.invoke({
      question: content,
      context: relevanceInfo.content,
    });

    const responseContent: any = response.content;

    const message = {
      content: responseContent,
      chatId: chatId,
      userType: 'AI',
    };
    const userId = 'GPT-3.5-turbo-mutdaai01';
    const creatMessageRes = await this.messageService.createMsg(
      message,
      userId,
    );
    return creatMessageRes;
  }

  async createVector(filePath: string, filename: string) {
    `코드 시작하는 시간`;
    const startTime = performance.now();

    const vectorStoreIndex = 'test-index';
    const pdfLoader = new PDFLoader(filePath, {
      splitPages: true,
    });
    const pdfDocs = await pdfLoader.load();

    `Text 자르기 기능 구현`;
    const splitter = new CharacterTextSplitter({
      separator: '\n',
      chunkSize: 500,
      chunkOverlap: 200,
    });

    `메타데이터 넣어서 데이터 편집하기`;
    //const splitDocs = await splitter.splitDocuments(pdfDocs);
    const splitDocsArray = await Promise.all(
      pdfDocs.map(async (doc) => {
        // 텍스트 분할
        const chunks = await splitter.splitDocuments([doc]);
        // 분할된 각 청크에 메타데이터 추가
        return chunks.map((chunk) => ({
          pageContent: chunk.pageContent,
          metadata: chunk.metadata.loc.pageNumber,
        }));
      }),
    );
    const splitDocs = splitDocsArray.flat();

    await Promise.all(
      splitDocs.map(async (document, index) => {
        const embeddingRes = await this.openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: document.pageContent,
        });

        //console.log('[storeEmbedding]: ', embeddingRes);
        const embeddings = embeddingRes.data[0].embedding;

        const pcIndex = this.pc.index(vectorStoreIndex);

        const pageContent = document.pageContent.replace(/\n/g, ' '); // 개행문자 공백으로 만드릭

        return await pcIndex.namespace(filename).upsert([
          {
            id: `${index}-${filename}`,
            values: embeddings,
            metadata: {
              content: pageContent,
              page_num: document.metadata,
            },
          },
        ]);
      }),
    );

    `코드 끝나는 시간`;
    const endTime = performance.now();
    const seconds = Math.floor(endTime - startTime) / 1000;
    console.log(`Execution time: ${seconds} milliseconds`);

    return { namespace: filename, index: vectorStoreIndex };
  }
}
