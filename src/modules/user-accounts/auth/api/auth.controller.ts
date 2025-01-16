import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { LoginCredentialsDto } from './input-dto/login-credentials.dto';
import { NewPasswordInputDto } from './input-dto/new-password-input.dto';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery-input.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/use-cases/commands/register-user.usecase';
import { ConfirmUserRegistrationCommand } from '../application/use-cases/commands/confirm-user-registration.usecase';
import { RegistrationEmailResendingCommand } from '../application/use-cases/commands/registration-email-resending.usecase';
import { LoginUserCommand } from '../application/use-cases/commands/login-user.usecase';
import { UserPasswordRecoveryCommand } from '../application/use-cases/commands/user-password-recovery.usecase';
import { UserNewPasswordCommand } from '../application/use-cases/commands/user-new-password.usecase';
import { Request, Response } from 'express';
import { GetMeViewDto } from '../../users/api/view-dto/get-me-view.dto';
import { RefreshTokenCommand } from '../application/use-cases/commands/refresh-token.usecase';
import { TokensPairDto } from '../dto/tokens-pair.dto';
import { RefreshJwtPayload } from 'src/core/dto/refresh-jwt-payload';
import { LogoutUserCommand } from '../application/use-cases/commands/logout-user.usecase';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string', example: 'login123' },
        password: { type: 'string', example: 'superpassword' },
        email: { type: 'string', example: 'smth@mail.ru' },
      },
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute<RegisterUserCommand, void>(new RegisterUserCommand(body));
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body('code') code: string): Promise<void> {
    await this.commandBus.execute<ConfirmUserRegistrationCommand, void>(new ConfirmUserRegistrationCommand(code));
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
      },
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body('email') email: string): Promise<void> {
    await this.commandBus.execute<RegistrationEmailResendingCommand, void>(
      new RegistrationEmailResendingCommand(email),
    );
  }

  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginCredentialsDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ): Promise<{ accessToken: string }> {
    const userAgent = req.headers['user-agent'] || 'Unknown device';

    const { refreshToken, accessToken } = await this.commandBus.execute<
      LoginUserCommand,
      { accessToken: string; refreshToken: string }
    >(new LoginUserCommand(body, userAgent, ipAddress));

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh-jwt-auth-guard'))
  async refreshToken(
    @ExtractUserFromRequest() userTokenPayload: RefreshJwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.commandBus.execute<RefreshTokenCommand, TokensPairDto>(
      new RefreshTokenCommand(userTokenPayload),
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() body: PasswordRecoveryInputDto): Promise<void> {
    await this.commandBus.execute<UserPasswordRecoveryCommand, void>(new UserPasswordRecoveryCommand(body));
  }

  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    await this.commandBus.execute<UserNewPasswordCommand, void>(new UserNewPasswordCommand(body));
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-auth-guard'))
  async me(@ExtractUserFromRequest() user: UserContext): Promise<GetMeViewDto> {
    const me = await this.usersQueryRepository.getMe(+user.userId);

    if (!me) {
      throw new NotFoundException('user not found');
    }

    return me;
  }

  @Post('logout')
  @UseGuards(AuthGuard('refresh-jwt-auth-guard'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @ExtractUserFromRequest() userTokenPayload: RefreshJwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.commandBus.execute<LogoutUserCommand, void>(new LogoutUserCommand(userTokenPayload.deviceId));
    res.clearCookie('refreshToken');
  }
}
