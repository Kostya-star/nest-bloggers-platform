import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input-dto/create-user-input.dto';
import { AuthService } from '../application/auth.service';
import { LoginCredentialsDto } from './input-dto/login-credentials.dto';
import { NewPasswordInputDto } from './input-dto/new-password-input.dto';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery-input.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
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
    await this.authService.registration(body);
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
    await this.authService.confirmRegistration(code);
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
    await this.authService.resendCode(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginCredentialsDto): Promise<{ accessToken: string }> {
    // const userAgent = req.headers['user-agent'] || 'Unknown device';
    // const ipAddress = req.ip;
    return await this.authService.login(body /*, userAgent, ipAddress!*/);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
      },
    },
  })
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() body: PasswordRecoveryInputDto): Promise<void> {
    await this.authService.recoverPassword(body.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    await this.authService.newPassword(body);
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
