import { IsEnum } from 'class-validator';
import { CheckIsStringAndTrim } from 'src/core/decorators/check-is-string-and-trim.decorator';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/likes-status';

export class LikeStatusInputDto {
  @CheckIsStringAndTrim()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
