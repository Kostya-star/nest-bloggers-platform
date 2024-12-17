import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserInputDto } from '../../users/api/input.dto/create-user-input.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  // @UseFilters(ValidationExceptionFilter)
  async registration(@Body() body: CreateUserInputDto) {
    await this.authService.registration(body);
  }
}
