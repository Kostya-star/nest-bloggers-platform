import { UserEmailConfirmationDto } from 'src/modules/user-accounts/users/dto/user-email-confirmation.dto';

export class CreateUserDto {
  login: string;
  email: string;
  hashedPassword: string;
  emailConfirmation?: UserEmailConfirmationDto;
}
