import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtToken } from 'src/common/interface';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.Authentication,
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtToken) {
    const { _id, ip } = payload;
    const objectId = new Types.ObjectId(_id);
    const checkUser = await this.usersService.findUserByIdAndIp(objectId, ip);

    if (!checkUser) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
