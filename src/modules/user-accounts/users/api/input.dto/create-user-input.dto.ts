import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { emailConstraints, loginConstraints, passwordConstraints } from '../../domain/user.schema';

export class CreateUserInputDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  @Matches(loginConstraints.match)
  login: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  password: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @Matches(emailConstraints.match)
  email: string;
}
