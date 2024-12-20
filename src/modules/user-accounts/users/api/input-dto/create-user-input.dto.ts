import { Length, Matches } from 'class-validator';
import { emailConstraints, loginConstraints, passwordConstraints } from '../../domain/user.schema';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';

export class CreateUserInputDto {
  @CheckIsStringAndTrim()
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  @Matches(loginConstraints.match)
  login: string;

  @CheckIsStringAndTrim()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;

  @CheckIsStringAndTrim()
  @Matches(emailConstraints.match)
  email: string;
}
