import { LikeStatus } from '../../likes/const/like-status';
import { Like } from '../../likes/domain/likes.schema-typeorm';

interface ILikesInfoReturned<L> {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  // newestLikes: JoinedLike[];
  newestLikes: L[];
}

export function getLikesInfo<L extends Like>(allLikes: L[], currentUserId: string): ILikesInfoReturned<L> {
  const likes = allLikes.filter((like) => like.status === LikeStatus.Like);
  const dislikesCount = allLikes.filter((like) => like.status === LikeStatus.Dislike).length;
  const myStatus =
    allLikes.find((like) => {
      return currentUserId.toString() === like.userId.toString();
    })?.status ?? LikeStatus.None;

  const newestLikes = likes.slice(0, 3);

  return { likesCount: likes.length, dislikesCount, myStatus, newestLikes };
}
