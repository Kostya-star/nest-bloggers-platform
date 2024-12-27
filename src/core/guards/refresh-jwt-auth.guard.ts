import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CoreConfig } from '../core.config';
import { Request } from 'express';
import { RefreshJwtContext } from '../dto/refresh-jwt-context';

@Injectable()
export class RefreshJwtAuthGuard extends PassportStrategy(Strategy, 'refresh-jwt-auth-guard') {
  constructor(private coreConfig: CoreConfig) {
    super({
      // __ASK__
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshToken = req?.cookies?.refreshToken;

          if (!refreshToken) console.error('no refresh token provided!');

          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: coreConfig.refreshTokenSecret,
    });
  }

  validate(payload: RefreshJwtContext): RefreshJwtContext {
    return payload;
  }
}
