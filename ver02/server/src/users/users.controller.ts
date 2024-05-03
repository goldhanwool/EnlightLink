import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { getIp, transferIdToString } from 'src/common/utils';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async createUser(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ipAddress: string = await getIp(req);

    const createUserDto: CreateUserDto = {
      ip: ipAddress,
      createdAt: new Date(),
    };

    const createUser: User = await this.usersService.create(createUserDto);

    if (createUser) {
      const _id: string = await transferIdToString(createUser._id);
      return this.authService.sendCookie(response, _id, createUser.ip);
    } else {
      throw new Error('User Create Error');
    }
  }

  @Get('/checkUser')
  async createValidationUser(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ipAddress: string = await getIp(req);
    const checkUser: User | null = await this.usersService.findOne(ipAddress);

    if (checkUser) {
      const _id: string = await transferIdToString(checkUser._id);
      return this.authService.sendCookie(response, _id, checkUser.ip);
    } else {
      const createUserDto: CreateUserDto = {
        ip: ipAddress,
        createdAt: new Date(),
      };

      const createUser: User = await this.usersService.create(createUserDto);

      if (createUser) {
        const _id: string = await transferIdToString(createUser._id);
        return this.authService.sendCookie(response, _id, createUser.ip);
      } else {
        throw new Error('User Create Error');
      }
    }
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.usersService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
