import { LikeStatus } from '../domain/likes-status';

export class LikesBaseViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
