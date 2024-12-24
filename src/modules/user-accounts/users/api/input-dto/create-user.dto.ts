import { EmailConfirmationDto } from 'src/modules/user-accounts/auth/dto/email-confirmation.dto';

export class CreateUserDto {
  login: string;
  email: string;
  hashedPassword: string;
  emailConfirmation?: EmailConfirmationDto;
}
