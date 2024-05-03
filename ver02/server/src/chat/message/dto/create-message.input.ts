import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => String, { description: '메세지 내용' }) //() => Int는 필드의 타입을 정의할 때 사용되는 함수
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  chatId: string;

  @Field()
  @IsNotEmpty()
  userType: string;
}
