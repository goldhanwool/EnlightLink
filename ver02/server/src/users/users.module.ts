import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from 'src/database/database.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
