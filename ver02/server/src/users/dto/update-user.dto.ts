import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Field, InputType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: '661fd7e9bac5d2b547b01899',
    description: 'id of user',
    required: true,
  })
  @Prop()
  @Field()
  _id: string;
}
