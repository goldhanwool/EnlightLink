import { InputType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateRagInput {
  @ApiProperty({
    example: 'what is the fastest car in the world?',
    description: 'content: query',
    required: true,
  })
  @Prop()
  content: string;
}

@InputType()
export class QueryRagInput {
  @ApiProperty({
    example: 'what is the fastest car in the world?',
    description: 'content: query',
    required: true,
  })
  @Prop()
  question: string;
}
