import { Matches } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { emailConstraints } from 'src/modules/user-accounts/users/domain/user.schema';

export class PasswordRecoveryInputDto {
  @CheckIsStringAndTrim()
  @Matches(emailConstraints.match)
  email: string;
}
