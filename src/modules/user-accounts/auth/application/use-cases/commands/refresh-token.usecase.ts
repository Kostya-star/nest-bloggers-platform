import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshJwtContext } from 'src/core/dto/refresh-jwt-context';
import { DevicesCommandsRepository } from 'src/modules/user-accounts/devices/infrastructure/devices-commands.repository';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { getISOFromUnixSeconds } from '../../../util/get-iso-from-unix-seconds';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../const/auth-tokens-consts.injection';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from '../../../dto/tokens-pair.dto';

export class RefreshTokenCommand {
  constructor(public token: RefreshJwtContext) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand, TokensPairDto> {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private devicesCommandsRepository: DevicesCommandsRepository,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN) private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN) private refreshTokenContext: JwtService,
  ) {}

  async execute({ token }: RefreshTokenCommand): Promise<TokensPairDto> {
    const { deviceId, iat, userId } = token;

    const user = await this.usersCommandsRepository.findUserById(userId);

    // __ASK__ does it make sense to do these checks??
    if (!user) {
      throw new UnauthorizedException();
    }

    const device = await this.devicesCommandsRepository.findDeviceByDeviceId(deviceId);

    // __ASK__ does it make sense to do these checks??
    if (!device) {
      throw new UnauthorizedException();
    }

    // make sure the token isn't revoked
    if (getISOFromUnixSeconds(iat) !== device.issuedAt) {
      throw new UnauthorizedException();
    }

    const accessToken = this.accessTokenContext.sign({ userId: user._id.toString() });
    const refreshToken = this.refreshTokenContext.sign({ userId: user._id.toString(), deviceId });

    {
      const { iat, exp } = this.refreshTokenContext.decode(refreshToken) as RefreshJwtContext;

      const iatISO = getISOFromUnixSeconds(iat);
      const expISO = getISOFromUnixSeconds(exp);

      // revoke the token by updating the issuedAt prop of the session
      await this.devicesCommandsRepository.updateDevice(deviceId, {
        issuedAt: iatISO,
        lastActiveDate: iatISO,
        expiresAt: expISO,
      });
    }

    return { accessToken, refreshToken };
  }
}
