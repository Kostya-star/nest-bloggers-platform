import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParams } from '../api/input.dto/get-comments-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, ICommentModel } from '../domain/comments.schema';
import { ILikeModel, Like } from '../../likes/domain/likes.schema';
import { getLikesInfo } from '../../utils/get-likes-info';
import { CommentsViewDto } from '../api/view.dto/comments-view.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: ICommentModel,
    @InjectModel(Like.name) private LikeModel: ILikeModel,
  ) {}

  async getCommentsForPost(
    query: GetCommentsQueryParams,
    postId: string,
    currentUserId: string | undefined = '',
  ): Promise<BasePaginatedView<CommentsViewDto>> {
    const { pageNumber: page, pageSize } = query;
    const { sortOptions, limit, skip } = query.processQueryParams();

    const items = await this.CommentModel.find({ postId })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await this.CommentModel.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const commentIds = items.map((comm) => comm._id);
    const likes = await this.LikeModel.find({
      likedEntityId: { $in: commentIds },
    }).lean();

    const commentsLikesInfo = commentIds.map((commentId) => {
      const commentLikes = likes.filter((like) =>
        like.likedEntityId.equals(commentId),
      );
      const likesInfo = getLikesInfo(commentLikes, currentUserId);

      return { commentId, ...likesInfo };
    });

    const finalItems = items.map((baseComm) => {
      const { likesCount, dislikesCount, myStatus } = commentsLikesInfo.find(
        (comm) => comm.commentId.equals(baseComm._id),
      )!;
      return {
        ...baseComm,
        likesInfo: { likesCount, dislikesCount, myStatus },
      };
    });

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: finalItems.map((c) => new CommentsViewDto(c)),
    };
  }

  // async getCommentById(
  //   commentId: MongooseObjtId,
  //   currentUserId?: MongooseObjtId,
  // ): Promise<ICommentView | null> {
  //   const comment = await this.CommentModel.findOne({ _id: commentId }).lean();
  //   if (!comment) return null;

  //   const commentLikes = await this.LikeModel.find({
  //     likedEntityId: commentId,
  //   }).lean();

  //   const { newestLikes, ...likesInfo } = getLikesInfo(
  //     commentLikes,
  //     currentUserId,
  //   );

  //   return commentObjMapper({ ...comment, likesInfo });
  // }
}
