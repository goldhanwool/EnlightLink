import { InputType, Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType()
export class CreateChatInput {
  @Prop()
  @Field()
  originFileName: string;

  @Prop()
  @Field()
  filename: string;

  @Prop()
  @Field()
  targetId: string;

  @Field()
  @Prop()
  pineconeNamespace: string;

  @Field()
  @Prop()
  pineconeIndex: string;

  @Field()
  @Prop()
  imageUrl: string;
}
