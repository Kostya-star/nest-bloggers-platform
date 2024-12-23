import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CoreConfig } from '../core.config';

@Injectable()
export class BasicAuthGuard {
  private validUsername: string;
  private validPassword: string;

  constructor(coreConfig: CoreConfig) {
    this.validUsername = coreConfig.basicAuthUsername || '';
    this.validPassword = coreConfig.basicAuthPassword || '';
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
