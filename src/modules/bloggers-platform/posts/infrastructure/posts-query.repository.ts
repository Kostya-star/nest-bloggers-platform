import { Injectable } from '@nestjs/common';
import { getLikesInfo } from '../../utils/get-likes-info';
import { PostsViewDto } from '../api/view-dto/posts-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params';
import { DataSource } from 'typeorm';
import { Post } from '../domain/posts.schema-typeorm';
import { Like } from '../../likes/domain/likes.schema-typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(private dataSource: DataSource) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    currentUserId: string | undefined = '',
    blogId?: string,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection } = query;

    const offset = (page - 1) * pageSize;

    let posts;
    // __ASK__
    if (blogId) {
      posts = await this.dataSource.query<Post[]>(
        `
          SELECT * FROM posts
          WHERE blog_id = $1
          ORDER BY ${sortBy} ${sortDirection}
          LIMIT $2 OFFSET $3
        `,
        [blogId, pageSize, offset],
      );
    } else {
      posts = await this.dataSource.query<Post[]>(
        `
          SELECT * FROM posts
          ORDER BY ${sortBy} ${sortDirection}
          LIMIT $1 OFFSET $2
        `,
        [pageSize, offset],
      );
    }

    let totalCountRes;
    if (blogId) {
      totalCountRes = await this.dataSource.query<{ count: string }[]>(
        `
        SELECT COUNT(*) FROM posts
        WHERE blog_id = $1
        `,
        [blogId],
      );
    } else {
      totalCountRes = await this.dataSource.query<{ count: string }[]>(
        `
        SELECT COUNT(*) FROM posts
        `,
      );
    }

    const totalCount = parseInt(totalCountRes[0].count);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post.id.toString());

    const likes = await this.dataSource.query<Like[]>(
      `
        SELECT * FROM likes
        WHERE liked_entity_id = ANY($1)
        ORDER BY updated_at DESC
      `,
      [postIds],
    );

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.liked_entity_id.toString() === postId.toString());
      const likesInfo = getLikesInfo(allPostLikes, currentUserId);

      return { postId, ...likesInfo };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } = postsLikesInfo.find(
        (post) => post.postId.toString() === basePost.id.toString(),
      )!;
      return {
        ...basePost,
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: finalItems.map((p) => new PostsViewDto(p)),
    };
  }

  async getPostById(postId: string, currentUserId: string | undefined = ''): Promise<PostsViewDto | null> {
    const _post = await this.dataSource.query<Post[]>(
      `
        SELECT * FROM posts
        WHERE id = $1 
      `,
      [postId],
    );

    const post = _post[0];

    if (!post) return null;

    const allLikes = await this.dataSource.query<Like[]>(
      `
        SELECT * FROM likes
        WHERE liked_entity_id = $1
        ORDER BY updated_at DESC
      `,
      [postId],
    );

    const extendedLikesInfo = getLikesInfo(allLikes, currentUserId);

    return new PostsViewDto({ ...post, extendedLikesInfo });
  }
}
