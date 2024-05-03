import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { Module, forwardRef } from '@nestjs/common';
import { MessageModule } from 'src/chat/message/message.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [forwardRef(() => MessageModule), forwardRef(() => ChatModule)],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
