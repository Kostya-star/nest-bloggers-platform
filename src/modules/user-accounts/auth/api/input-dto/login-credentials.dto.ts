import { Length, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from 'src/modules/user-accounts/users/domain/user.schema';

// Custom validator to check if the value is a valid email or login
@ValidatorConstraint({ name: 'loginOrEmail', async: false })
export class IsLoginOrEmailConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const isEmail = emailConstraints.match.test(value);
    const isLogin = loginConstraints.match.test(value);

    if (!isLogin && !isEmail) return false;

    if (isLogin) {
      if (value.length < loginConstraints.minLength) return false;
      if (value.length > loginConstraints.maxLength) return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The field ${args.property} must be a valid email or login`;
  }
}

export class LoginCredentialsDto {
  @CheckIsStringAndTrim()
  @Validate(IsLoginOrEmailConstraint)
  loginOrEmail: string;

  @CheckIsStringAndTrim()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;
}
