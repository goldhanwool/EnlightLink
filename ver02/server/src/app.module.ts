import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UploadsModule } from './uploads/uploads.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import { RagModule } from './rag/rag.module';
import { MessageModule } from './chat/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        cors: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              try {
                const request: Request = context.extra.request;
                const user = authService.verifyWs(request);
                context.user = user;
              } catch (error) {
                new Logger().error(error);
                throw new UnauthorizedException('Unauthorized');
              }
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ChatModule,
    UploadsModule,
    PubSubModule,
    RagModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
