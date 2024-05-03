import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '127.0.255',
    description: 'ip address',
  })
  @IsString()
  ip: string;

  @IsOptional()
  createdAt: Date;
}
