import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  ip: string;

  @Field()
  createdAt: Date;
}
