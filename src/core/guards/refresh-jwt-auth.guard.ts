import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CoreConfig } from '../core.config';
import { Request } from 'express';
import { RefreshJwtContext } from '../dto/refresh-jwt-context';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { DevicesCommandsRepository } from 'src/modules/user-accounts/devices/infrastructure/devices-commands.repository';
import { getISOFromUnixSeconds } from 'src/core/util/get-iso-from-unix-seconds';
import { RefreshJwtPayload } from '../dto/refresh-jwt-payload';

@Injectable()
export class RefreshJwtAuthGuard extends PassportStrategy(Strategy, 'refresh-jwt-auth-guard') {
  constructor(
    private coreConfig: CoreConfig,
    private usersCommandsRepository: UsersCommandsRepository,
    private devicesCommandsRepository: DevicesCommandsRepository,
  ) {
    super({
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

  async validate(payload: RefreshJwtContext): Promise<RefreshJwtPayload> {
    const { deviceId, iat, userId } = payload;

    const user = await this.usersCommandsRepository.findUserById(+userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const device = await this.devicesCommandsRepository.findDeviceByDeviceId(deviceId);

    if (!device) {
      throw new UnauthorizedException();
    }

    // make sure the token isn't revoked
    // TODO maybe move getISOFromUnixSeconds outside of the module
    if (getISOFromUnixSeconds(iat) !== device.issuedAt.toISOString()) {
      throw new UnauthorizedException();
    }

    return { deviceId, userId };
  }
}
