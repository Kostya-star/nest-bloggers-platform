export class UserEmailConfirmationDto {
  code: string | null;
  expDate: Date | null;
  isConfirmed: boolean;
}
