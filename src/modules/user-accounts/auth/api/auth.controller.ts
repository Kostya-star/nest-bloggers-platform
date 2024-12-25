import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from '@nestjs/common';
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
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body('email') email: string): Promise<void> {
    await this.commandBus.execute<RegistrationEmailResendingCommand, void>(
      new RegistrationEmailResendingCommand(email),
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginCredentialsDto): Promise<{ accessToken: string }> {
    // const userAgent = req.headers['user-agent'] || 'Unknown device';
    // const ipAddress = req.ip;

    return await this.commandBus.execute<LoginUserCommand, { accessToken: string /*refreshToken: string*/ }>(
      new LoginUserCommand(body /*, userAgent, ipAddress!*/),
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() body: PasswordRecoveryInputDto): Promise<void> {
    await this.commandBus.execute<UserPasswordRecoveryCommand, void>(new UserPasswordRecoveryCommand(body));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    await this.commandBus.execute<UserNewPasswordCommand, void>(new UserNewPasswordCommand(body));
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-auth-guard'))
  me(@ExtractUserFromRequest() user: UserContext): any {
    const me = this.usersQueryRepository.getMe(user.userId);

    if (!me) {
      throw new NotFoundException('user not found');
    }

    return me;
  }
}
