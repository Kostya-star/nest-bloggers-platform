import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { getLikesInfo } from '../../common/utils/get-likes-info';
import { CommentsViewDto } from '../api/view-dto/comments-view.dto';
import { DataSource } from 'typeorm';
import { JoinedLike } from '../../common/dto/joined-like';
import { JoinedComment } from '../dto/joined-comment';

@Injectable()
export class CommentsQueryRepository {
  constructor(private dataSource: DataSource) {}

  async getCommentsForPost(
    query: GetCommentsQueryParams,
    postId: string,
    currentUserId: string | undefined = '',
  ): Promise<BasePaginatedView<CommentsViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection } = query;

    const offset = (page - 1) * pageSize;

    const comments = await this.dataSource.query<(JoinedComment & { count: string })[]>(
      `
        SELECT c.*, u.login as user_login, 
        (SELECT COUNT(*) FROM comments WHERE "postId" = $1) AS count
        FROM comments c

        LEFT JOIN users u
        ON c."userId" = u.id
        WHERE c."postId" = $1
        ORDER BY c."${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
        `,
      [postId, pageSize, offset],
    );

    // const totalCountRes = await this.dataSource.query<{ count: string }[]>(
    //   `
    //     SELECT COUNT(*) FROM comments
    //     WHERE "postId" = $1
    //   `,
    //   [postId],
    // );

    const totalCount = parseInt(comments[0].count);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentIds = comments.map((comm) => comm.id);

    const likes = await this.dataSource.query<JoinedLike[]>(
      `
        SELECT l.*, u.login as user_login FROM likes l
        LEFT JOIN users u
        ON l.user_id = u.id
        WHERE liked_entity_id = ANY($1)
      `,
      [commentIds],
    );

    const commentsLikesInfo = commentIds.map((commentId) => {
      const commentLikes = likes.filter((like) => like.liked_entity_id.toString() === commentId.toString());
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

  async getCommentById(commentId: string, currentUserId: string | undefined = ''): Promise<CommentsViewDto | null> {
    const comm = await this.dataSource.query<JoinedComment[]>(
      `
      SELECT c.*, u.login as user_login FROM comments c
      LEFT JOIN users u
      ON c."userId" = u.id
      WHERE c.id = $1 
      `,
      [commentId],
    );

    const comment = comm[0];

    if (!comment) return null;

    const commentLikes = await this.dataSource.query<JoinedLike[]>(
      `
        SELECT l.*, u.login as user_login FROM likes l
        LEFT JOIN users u
        ON l.user_id = u.id
        WHERE l.liked_entity_id = $1
      `,
      [commentId],
    );

    const { newestLikes, ...likesInfo } = getLikesInfo(commentLikes, currentUserId);

    return new CommentsViewDto({ ...comment, likesInfo });
  }
}
