export class CreateUserDto {
  login: string;
  email: string;
  hashedPassword: string;
  emailConfirmationCode: string | null;
  emailConfirmationExpDate: Date | null;
  emailConfirmationIsConfirmed: boolean;
}
