import { Length } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { passwordConstraints } from 'src/modules/user-accounts/users/domain/user.schema';

export class NewPasswordInputDto {
  @CheckIsStringAndTrim()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  newPassword: string;

  @CheckIsStringAndTrim()
  recoveryCode: string;
}
