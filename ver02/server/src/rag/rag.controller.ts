import { Controller, Get } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { fee } from 'src/common/utils';
import { Pinecone } from '@pinecone-database/pinecone';
import { ChatOpenAI } from '@langchain/openai';

@ApiTags('Rag')
@Controller('rag')
export class RagController {
  private readonly openai: OpenAI;
  private readonly pc: Pinecone;
  private model: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
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

  @Get('/gpt/conn')
  async checkConnGPT() {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: 'GPT connection test',
        },
      ],
    });
    const bill = await fee(
      response['usage']['prompt_tokens'],
      response['usage']['completion_tokens'],
    );
    return { gpt_answer: response.choices[0].message.content, bill: bill };
  }
  @Get('/pinecone/create')
  async pineconeCreate() {
    const idxName = 'test-index';
    await this.pc.createIndex({
      name: idxName,
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws', //생성가능한 cloud와 region을 확인할 것
          region: 'us-east-1',
        },
      },
    });
  }
  @Get('/pinecone/conn')
  async checkConnPinecone() {
    const index: any = this.pc.index('embedding-index');
    return index.target;
  }
  async generareNumberArray(length: number) {
    return Array.from({ length }, () => Math.random());
  }
  @Get('/pinecone/basic/upsert')
  async pineCone() {
    const embedding = await this.generareNumberArray(1536);
    const index: any = this.pc.index('embedding-index');

    const upsertResult = await index.upsert([
      {
        id: 'id-1',
        values: embedding,
        metadata: {
          idx: 3,
          reference: 'abcd',
        },
      },
    ]);
    return upsertResult;
  }
  @Get('/pinecone/query')
  async queryVectors() {
    const index: any = this.pc.index('embedding-index');
    return await index.query({
      id: 'id-1',
      topK: 1,
      includeMetadata: true,
    });
  }
} // end of RagController
