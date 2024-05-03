import { AbstractRepository } from 'src/database/database.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatRepository extends AbstractRepository<Chat> {
  protected readonly logger = new Logger(ChatRepository.name);
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<Chat>) {
    super(chatModel);
  }
}
