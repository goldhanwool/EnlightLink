import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
@ObjectType()
export class AbstractEntity {
  @Prop({ type: SchemaTypes.ObjectId }) // MongoDB의 ObjectId 타입을 사용
  @Field(() => ID) //GraphQL의 ID 타입을 사용, ID는 고유 식별자, 주로 문자열로 사용
  _id: Types.ObjectId; //Types.ObjectId는 Mongoose의 타입 시스템을 통해 MongoDB의 ObjectId 타입
}
