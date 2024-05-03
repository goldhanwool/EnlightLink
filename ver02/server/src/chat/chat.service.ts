import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async create(createChatInput: CreateChatInput, _id: string) {
    return this.chatRepository.create({
      ...createChatInput,
      userId: _id,
      createdAt: new Date(),
    });
  }

  async findChats() {
    return this.chatRepository.find({});
  }

  async findAll(_id: string) {
    return this.chatRepository.find({
      $or: [
        { userId: _id },
        {
          targetId: _id,
        },
      ],
    });
  }

  async findOne(chatId: string) {
    return this.chatRepository.findOne({ _id: chatId });
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id}, ${updateChatInput} chat`;
  }

  remove(chatId: string) {
    return this.chatRepository.findOneAndDelete({ _id: chatId });
  }
}
