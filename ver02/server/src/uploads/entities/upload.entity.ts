import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/database/entity/abstract.entity';

@Schema({ versionKey: false })
@ObjectType()
export class Upload extends AbstractEntity {
  @Field()
  @Prop()
  filename: string;

  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  originFileName: string;

  @Field()
  @Prop()
  createdAt: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
