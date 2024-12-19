import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { AuthService } from '../application/auth.service';
import { LoginCredentialsDto } from './input.dto/login-credentials.dto';
import { NewPasswordInputDto } from './input.dto/new-password-input.dto';
import { PasswordRecoveryInputDto } from './input.dto/password-recovery-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.authService.registration(body);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body('code') code: string): Promise<void> {
    await this.authService.confirmRegistration(code);
  }

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
}
