import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/database/entity/abstract.entity';

@ObjectType()
@Schema()
export class Message extends AbstractEntity {
  //@Field() 데코레이터는 해당 필드가 GraphQL 스키마에 포함되어야 함을 나타냄
  @Field()
  @Prop()
  chatId: string;

  @Field(() => String, { description: '메세지 컨텐츠' }) //() => Int는 필드의 타입을 정의할 때 사용되는 함수
  @Prop()
  content: string;

  @Field()
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  userType: string;
}
