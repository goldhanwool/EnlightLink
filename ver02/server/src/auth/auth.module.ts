import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  // imports 배열 -> 다른 모듈들을 현재 모듈로 가져오는 역할
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      //useFactory 함수는 JwtModule의 설정을 비동기적으로 생성 팩토리 함수로,
      //이 함수가 실행될 때 필요한 의존성들을 NestJS가 주입해줘야 인자로 받아올 수 있음
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.getOrThrow('JWT_SECRET');
        const jwtExpiration = Number(
          configService.getOrThrow('JWT_EXPIRATION'),
        );
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiration,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
