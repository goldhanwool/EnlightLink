import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.guard';
import { CurrentUser } from 'src/auth/decorator/current-user';
import { JwtToken } from 'src/common/interface';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  @UseGuards(GqlAuthGuard)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() user: JwtToken,
  ) {
    return this.chatService.create(createChatInput, user._id);
  }

  @Query(() => [Chat], { name: 'chats' })
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: JwtToken) {
    return this.chatService.findAll(user._id);
  }

  @Query(() => Chat, { name: 'chat' })
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('chatId') chatId: string) {
    return await this.chatService.findOne(chatId);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat, { name: 'removeChat' })
  @UseGuards(GqlAuthGuard)
  async removeChat(@Args('chatId') chatId: string) {
    return this.chatService.remove(chatId);
  }
}
