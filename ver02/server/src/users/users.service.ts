import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersReposity: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersReposity.create(createUserDto);
  }

  findAll(_id: string) {
    return this.usersReposity.find({ _id });
  }

  async findUserByIdAndIp(_id: ObjectId | any, ip: string) {
    const user = await this.usersReposity.findOne({ ip: ip, _id: _id });
    return user;
  }

  async findOne(ip: string) {
    try {
      const user = await this.usersReposity.findOne({ ip: ip });
      return user;
    } catch (error) {
      return null;
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.usersReposity.findOneAndUpdate(updateUserDto, {
      ip: '127.0.0.1',
      updatedAt: new Date(),
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
