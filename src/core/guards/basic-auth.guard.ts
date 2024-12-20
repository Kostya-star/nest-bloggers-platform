import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard {
  private validUsername: string;
  private validPassword: string;

  constructor(configService: ConfigService) {
    this.validUsername = configService.get<string>('BASIC_AUTH_USERNAME') || '';
    this.validPassword = configService.get<string>('BASIC_AUTH_PASSWORD') || '';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authVal = request.headers.authorization;

    if (!authVal || typeof authVal !== 'string' || !authVal.startsWith('Basic')) {
      throw new UnauthorizedException();
    }

    const base64Creds = authVal.split(' ')[1] ?? '';
    const decodedcCreds = Buffer.from(base64Creds, 'base64').toString('ascii');
    const [username, password] = decodedcCreds.split(':');

    if (username !== this.validUsername || password !== this.validPassword) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
