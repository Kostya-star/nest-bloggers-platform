import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshJwtContext } from 'src/core/dto/refresh-jwt-context';
import { DevicesCommandsRepository } from 'src/modules/user-accounts/devices/infrastructure/devices-commands.repository';
import { getISOFromUnixSeconds } from '../../../util/get-iso-from-unix-seconds';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../const/auth-tokens-consts.injection';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from '../../../dto/tokens-pair.dto';
import { RefreshJwtPayload } from 'src/core/dto/refresh-jwt-payload';

export class RefreshTokenCommand {
  constructor(public tokenPayload: RefreshJwtPayload) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand, TokensPairDto> {
  constructor(
    private devicesCommandsRepository: DevicesCommandsRepository,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN) private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN) private refreshTokenContext: JwtService,
  ) {}

  async execute({ tokenPayload }: RefreshTokenCommand): Promise<TokensPairDto> {
    const { deviceId, userId } = tokenPayload;

    const accessToken = this.accessTokenContext.sign({ userId });
    const refreshToken = this.refreshTokenContext.sign({ userId, deviceId });

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
