import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCredentialsDto } from '../../../api/input-dto/login-credentials.dto';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../../const/auth-tokens-consts.injection';
import { RefreshJwtContext } from 'src/core/dto/refresh-jwt-context';
import { DevicesCommandsRepository } from 'src/modules/user-accounts/devices/infrastructure/devices-commands.repository';
import { getISOFromUnixSeconds } from 'src/core/util/get-iso-from-unix-seconds';

export class LoginUserCommand {
  constructor(
    public creds: LoginCredentialsDto,
    public userAgent: string,
    public ipAddress: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
  implements ICommandHandler<LoginUserCommand, { accessToken: string; refreshToken: string }>
{
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private devicesCommandsRepository: DevicesCommandsRepository,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN) private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN) private refreshTokenContext: JwtService,
  ) {}
  async execute({
    creds,
    userAgent,
    ipAddress,
  }: LoginUserCommand): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersCommandsRepository.findUserByLoginOrEmail(creds.loginOrEmail);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(creds.password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const deviceId = uuidv4();

    const accessToken = this.accessTokenContext.sign({ userId: user.id.toString() });
    const refreshToken = this.refreshTokenContext.sign({ userId: user.id.toString(), deviceId });

    const { iat, exp } = this.refreshTokenContext.decode(refreshToken) as RefreshJwtContext;

    const iatISO = getISOFromUnixSeconds(iat);
    const expISO = getISOFromUnixSeconds(exp);

    await this.devicesCommandsRepository.registerDevice({
      deviceId,
      userId: user.id,
      issuedAt: iatISO,
      expiresAt: expISO,
      userAgent,
      ipAddress,
      lastActiveDate: iatISO,
    });

    return { accessToken, refreshToken };
  }
}
