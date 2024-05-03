import { Field, InputType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType()
export class CreateUploadDto {
  @Prop()
  @Field()
  originFileName: string;

  @Prop()
  @Field()
  filename: string;
}
