import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { ChatRepository } from './chat.repository';
import { DatabaseModule } from 'src/database/database.module';
import { MessageModule } from './message/message.module';
import { Chat, ChatSchema } from './entities/chat.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessageModule),
  ],
  providers: [ChatResolver, ChatService, ChatRepository],
  exports: [ChatRepository, ChatService],
})
export class ChatModule {}
