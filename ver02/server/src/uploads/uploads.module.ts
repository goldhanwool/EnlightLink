import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsRepository } from './uploads.repository';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Upload, UploadSchema } from './entities/upload.entity';
import { UploadsResolver } from './uploads.resolver';
import { RagModule } from 'src/rag/rag.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    RagModule,
    UsersModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [UploadsController],
  providers: [
    UploadsController,
    UploadsService,
    UploadsRepository,
    UploadsResolver,
  ],
})
export class UploadsModule {}
