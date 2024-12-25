import { Comment } from '../../domain/comments.schema';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { LikesBaseViewDto } from 'src/modules/bloggers-platform/likes/api/likes-view.dto';

interface ILikesInfoView {
  likesInfo: LikesBaseViewDto;
}

interface ICommentDBWIthLikesInfo extends Comment, ILikesInfoView {
  _id: MongooseObjtId;
}

export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: LikesBaseViewDto;
  createdAt: Date;

  constructor(comment: ICommentDBWIthLikesInfo) {
    this.id = comment._id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    };
    this.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: comment.likesInfo.myStatus,
    };
    this.createdAt = comment.createdAt;
  }
}
