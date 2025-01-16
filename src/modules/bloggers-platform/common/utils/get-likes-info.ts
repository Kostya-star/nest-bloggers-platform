import { LikeStatus } from '../../likes/const/like-status';
import { JoinedLike } from '../dto/joined-like';

interface ILikesInfoReturned {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: JoinedLike[];
}

export function getLikesInfo(allLikes: JoinedLike[], currentUserId: string): ILikesInfoReturned {
  const likes = allLikes.filter((like) => like.status === LikeStatus.Like);
  const dislikesCount = allLikes.filter((like) => like.status === LikeStatus.Dislike).length;
  const myStatus =
    allLikes.find((like) => {
      return currentUserId.toString() === like.userId.toString();
    })?.status ?? LikeStatus.None;

  const newestLikes = likes.slice(0, 3);

  return { likesCount: likes.length, dislikesCount, myStatus, newestLikes };
}
