import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginCredentialsDto } from './input.dto/login-credentials.dto';

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

  @Post('login')
  async login(@Body() body: LoginCredentialsDto): Promise<{ accessToken: string }> {
    // const userAgent = req.headers['user-agent'] || 'Unknown device';
    // const ipAddress = req.ip;
    return await this.authService.login(body /*, userAgent, ipAddress!*/);
  }
}
