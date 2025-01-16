import { LikesBaseViewDto } from 'src/modules/bloggers-platform/likes/api/likes-view.dto';
import { Comment } from '../../domain/comments.schema-typeorm';
import { JoinedComment } from '../../dto/joined-comment';

interface ILikesInfoView {
  likesInfo: LikesBaseViewDto;
}

interface ICommentDBWIthLikesInfo extends JoinedComment, ILikesInfoView {
  // _id: MongooseObjtId;
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
    this.id = comment.id.toString();
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
    };
    this.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: comment.likesInfo.myStatus,
    };
    this.createdAt = comment.createdAt;
  }
}
