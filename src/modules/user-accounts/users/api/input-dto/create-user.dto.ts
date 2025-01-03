export class CreateUserDto {
  login: string;
  email: string;
  hashed_password: string;
  email_confirmation_code: string | null;
  email_confirmation_exp_date: Date | null;
  email_confirmation_is_confirmed: boolean;
}
