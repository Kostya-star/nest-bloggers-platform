import { IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { postContentConstraints, postDescriptionConstraints, postTitleConstraints } from '../../domain/posts.schema';
import { IsBlogIdValidAndExist } from '../validation/is-blogId-valid-and-exist-custom-validator.constraint';

export class CreatePostInputDto {
  @CheckIsStringAndTrim()
  @MaxLength(postTitleConstraints.maxLength)
  @IsNotEmpty()
  title: string;

  @CheckIsStringAndTrim()
  @MaxLength(postDescriptionConstraints.maxLength)
  @IsNotEmpty()
  shortDescription: string;

  @CheckIsStringAndTrim()
  @MaxLength(postContentConstraints.maxLength)
  @IsNotEmpty()
  content: string;

  @CheckIsStringAndTrim()
  @IsNotEmpty()
  @Validate(IsBlogIdValidAndExist)
  blogId: string;
}
