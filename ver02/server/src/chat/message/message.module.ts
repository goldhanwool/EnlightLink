import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ChatModule } from '../chat.module';
import { RagModule } from 'src/rag/rag.module';

@Module({
  imports: [forwardRef(() => ChatModule), RagModule],
  providers: [MessageResolver, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
