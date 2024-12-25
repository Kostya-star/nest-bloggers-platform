import { IsEnum } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/const/like-status';

// __ASK__ - absolutely the same is used for /posts and /comments. what to do?
export class LikeCommentStatusInputDto {
  @CheckIsStringAndTrim()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
