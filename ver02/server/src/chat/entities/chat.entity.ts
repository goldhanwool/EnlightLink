import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/database/entity/abstract.entity';
import { Message } from '../message/entities/message.entity';
import { IsNotEmpty } from 'class-validator';

@Schema({ versionKey: false })
@ObjectType()
export class Chat extends AbstractEntity {
  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  targetId: string;

  @Field(() => String, { defaultValue: 'GPT' })
  @Prop({ default: 'GPT' })
  aiId?: string;

  @Field()
  @Prop()
  @IsNotEmpty()
  pineconeNamespace: string;

  @Field()
  @Prop()
  @IsNotEmpty()
  pineconeIndex: string;

  @Field()
  @Prop()
  filename: string;

  @Field()
  @Prop()
  originFileName: string;

  @Field()
  @Prop()
  imageUrl: string;

  @Field(() => [Message])
  @Prop([Message])
  messages?: Message[];

  @Field(() => Boolean, { defaultValue: false })
  @Prop({ default: false })
  isDeleted?: boolean;

  @Field()
  @Prop()
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
