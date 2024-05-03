import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { CurrentUser } from 'src/auth/decorator/current-user';
import { JwtToken } from 'src/common/interface';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.guard';
import { PUB_SUB } from 'src/pubsub/subscript-token/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: JwtToken,
  ) {
    return this.messageService.createMsgGpt(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async findMessage(
    @Args('chatId') chatId: string,
    @CurrentUser() user: JwtToken,
  ) {
    const messages = await this.messageService.findOne(chatId, user._id);
    return messages;
  }

  @Mutation(() => Message)
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messageService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => Message)
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.remove(id);
  }

  //payload -> 메세지가 만들어지고 실제 구독에 전달하기위한 데이터
  //variables -> 구독을 위해 특정 조건을 위해 전달된 변수
  //payload: Message 객체,
  //variables: Client에서 hook으로 전달한 변수
  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      const userId = context.req.user._id;
      return (
        payload.messageCreated.chatId === variables.chatId &&
        payload.messageCreated.userId !== userId
      );
    },
  })
  messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
    @CurrentUser() user: JwtToken,
  ) {
    return this.messageService.messageCreated(messageCreatedArgs, user._id);
  }
}
