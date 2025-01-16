import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { getLikesInfo } from '../../common/utils/get-likes-info';
import { CommentsViewDto } from '../api/view-dto/comments-view.dto';
import { Repository } from 'typeorm';
import { JoinedLike } from '../../common/dto/joined-like';
import { JoinedComment } from '../dto/joined-comment';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../domain/comments.schema-typeorm';
import { Like } from '../../likes/domain/likes.schema-typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(Like) private likesRepository: Repository<Like>,
  ) {}

  async getCommentsForPost(
    query: GetCommentsQueryParams,
    postId: number,
    currentUserId: string | undefined = '',
  ): Promise<BasePaginatedView<CommentsViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const rawComments = await this.commentsRepository
      .createQueryBuilder('comm')
      .leftJoinAndSelect('comm.user', 'u')
      .select('comm')
      .addSelect('u.login', 'userLogin')
      .where('comm.postId = :postId', { postId })
      .orderBy(`comm.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .offset(skip)
      .limit(pageSize)
      .getRawMany();

    const comments = rawComments.map(
      (comm) =>
        ({
          id: comm.comm_id,
          content: comm.comm_content,
          postId: comm.comm_postId,
          userId: comm.comm_userId,
          userLogin: comm.userLogin,
          createdAt: comm.comm_createdAt,
          updatedAt: comm.comm_updatedAt,
        }) as JoinedComment,
    );

    const totalCount = await this.commentsRepository
      .createQueryBuilder('comm')
      .where('comm.postId = :postId', { postId })
      .getCount();

    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentIds = comments.map((comm) => comm.id);

    const likes = await this.likesRepository
      .createQueryBuilder('like')
      .where('like.likedEntityId = ANY(:commentIds)', { commentIds })
      .getMany();

    const commentsLikesInfo = commentIds.map((commentId) => {
      const commentLikes = likes.filter((like) => like.likedEntityId.toString() === commentId.toString());
      const likesInfo = getLikesInfo(commentLikes, currentUserId);

      return { commentId, ...likesInfo };
    });

    const finalItems = comments.map((baseComm) => {
      const { likesCount, dislikesCount, myStatus } = commentsLikesInfo.find(
        (comm) => comm.commentId.toString() === baseComm.id.toString(),
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

  async getCommentById(commentId: number, currentUserId: string | undefined = ''): Promise<CommentsViewDto | null> {
    const rawComment = await this.commentsRepository
      .createQueryBuilder('comm')
      .leftJoinAndSelect('comm.user', 'u')
      .select('comm')
      .addSelect('u.login', 'userLogin')
      .where('comm.id = :commentId', { commentId })
      .getRawOne();

    if (!rawComment) return null;

    const comment = {
      id: rawComment.comm_id,
      content: rawComment.comm_content,
      postId: rawComment.comm_postId,
      userId: rawComment.comm_userId,
      userLogin: rawComment.userLogin,
      createdAt: rawComment.comm_createdAt,
      updatedAt: rawComment.comm_updatedAt,
    } as JoinedComment;

    const rawCommentLikes = await this.likesRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.user', 'u')
      .select('like')
      .addSelect('u.login', 'userLogin')
      .where('like.likedEntityId = :commentId', { commentId })
      .getRawMany();

    const commentLikes = rawCommentLikes.map(
      (like) =>
        ({
          id: like.like_id,
          status: like.like_status,
          userId: like.like_userId,
          likedEntityId: like.like_likedEntityId,
          createdAt: like.like_createdAt,
          updatedAt: like.like_updatedAt,
          userLogin: like.userLogin,
        }) as JoinedLike,
    );

    const { newestLikes, ...likesInfo } = getLikesInfo(commentLikes, currentUserId);

    return new CommentsViewDto({ ...comment, likesInfo });
  }
}
