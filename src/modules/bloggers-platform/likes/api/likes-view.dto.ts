import { LikeStatus } from '../const/like-status';

export class LikesBaseViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
