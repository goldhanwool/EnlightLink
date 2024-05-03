import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/database/entity/abstract.entity';

@Schema({ versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  @Prop({ unique: false })
  @Field({ description: '사용자 아이피' })
  ip: string;

  @Prop()
  @Field()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
