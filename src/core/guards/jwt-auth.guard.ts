import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContext } from '../dto/user-context';
import { JwtContext } from '../dto/jwt-context';
import { CoreConfig } from '../core.config';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy, 'jwt-auth-guard') {
  constructor(private coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: coreConfig.accessTokenSecret,
    });
  }

  /**
   * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
   * @param payload
   */
  async validate({ userId }: JwtContext): Promise<UserContext> {
    return { userId };
  }
}
