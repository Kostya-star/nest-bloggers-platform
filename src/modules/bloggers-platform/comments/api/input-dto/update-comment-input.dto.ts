import { Length } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { commentContentConstraints } from 'src/modules/bloggers-platform/comments/domain/comments.schema';

export class UpdateCommentInputDto {
  @CheckIsStringAndTrim()
  @Length(commentContentConstraints.minLength, commentContentConstraints.maxLength)
  content: string;
}
