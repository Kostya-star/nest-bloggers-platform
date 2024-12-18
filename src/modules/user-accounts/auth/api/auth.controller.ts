import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { AuthService } from '../application/auth.service';
import { BadRequestValidationPipe } from 'src/core/pipes/bad-request-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @UsePipes(BadRequestValidationPipe)
  async registration(@Body() body: CreateUserInputDto) {
    await this.authService.registration(body);
  }
}
