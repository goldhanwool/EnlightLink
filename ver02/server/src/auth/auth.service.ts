import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
// import { getJwt } from './guards/getJwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  testCreateToken() {
    const tokenPayload = {
      username: 'test',
      sub: 1,
    };
    const token = this.jwtService.sign(tokenPayload);
    console.log('token', token);
    return 'This action adds a new auth';
  }

  async sendCookie(response: Response, _id: string, ip: string) {
    const nowDate = new Date();
    nowDate.setSeconds(
      nowDate.getSeconds() +
        Number(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const tokenPayload = {
      _id: _id,
      ip: ip,
    };

    if (!this.configService.get('JWT_SECRET')) {
      throw new Error('JWT_SECRET is not defined in the environment.');
    }

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
    });

    return token;
  }

  verifyWs(request: Request) {
    const cookies: string[] = request.headers.cookie.split('; ');
    const authCookie = cookies.find((cookie) =>
      cookie.includes('Authentication'),
    );
    const jwt = authCookie.split('Authentication=')[1];
    return this.jwtService.verify(jwt);
  }
}
