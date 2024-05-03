import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { ChatRepository } from '../chat.repository';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub/subscript-token/injection-token';
import { MessageCreatedArgs } from './dto/message-created.args';
import { RagService } from 'src/rag/rag.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly ragService: RagService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}
  async createMsg(
    { content, chatId, userType }: CreateMessageInput,
    userId: string,
  ) {
    const message: Message = {
      content,
      userId,
      chatId,
      userType,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    await this.pubSub.publish('MESSAGE_CREATED', {
      messageCreated: message,
    });
    return message;
  }

  async createMsgGpt(
    { content, chatId, userType }: CreateMessageInput,
    userId: string,
  ) {
    const message: Message = {
      content,
      userId,
      chatId,
      userType,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };
    await this.chatRepository.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    //!!여기서는 비동기로 걸어서 우선 실행하게 한다.결과가 나오면 subscribe로 넘어간다.
    this.ragService.sendMessageAi(chatId, content);
    return message;
  }

  async findAll(chatId: string) {
    return this.chatRepository.find({ chatId });
  }

  async findOne(chatId: string, userId: string) {
    return (
      await this.chatRepository.findOne({
        _id: chatId,
        $or: [{ userId }, { targetId: userId }],
      })
    ).messages;
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return `This action updates a #${id}, ${updateMessageInput} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async messageCreated({ chatId }: MessageCreatedArgs, userId: string) {
    await this.chatRepository.findOne({
      _id: chatId,
      $or: [{ userId }, { targetId: userId }],
    });
    return this.pubSub.asyncIterator('MESSAGE_CREATED');
  }
}
