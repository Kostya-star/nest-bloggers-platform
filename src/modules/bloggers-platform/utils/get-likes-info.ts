import { LikeStatus } from '../likes/const/like-status';
import { Like } from '../likes/domain/likes.schema';

interface ILikesInfoReturned {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Like[];
}

export function getLikesInfo(allLikes: Like[], currentUserId: string): ILikesInfoReturned {
  const likes = allLikes.filter((like) => like.status === LikeStatus.Like);
  const dislikesCount = allLikes.filter((like) => like.status === LikeStatus.Dislike).length;
  const myStatus =
    allLikes.find((like) => currentUserId.toString() === like.userId.toString())?.status ?? LikeStatus.None;
  const newestLikes = likes.slice(0, 3);

  return { likesCount: likes.length, dislikesCount, myStatus, newestLikes };
}
