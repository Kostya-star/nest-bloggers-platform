import { UserEmailConfirmationDto } from './user-email-confirmation.dto';

export class CreateUserDto {
  login: string;
  email: string;
  hashedPassword: string;
  emailConfirmation?: UserEmailConfirmationDto;
}
