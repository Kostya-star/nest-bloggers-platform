import { Injectable } from '@nestjs/common';
import { getLikesInfo } from '../../common/utils/get-likes-info';
import { PostsViewDto } from '../api/view-dto/posts-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/posts.schema-typeorm';
import { Like } from '../../likes/domain/likes.schema-typeorm';
import { JoinedLike } from '../../common/dto/joined-like';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    currentUserId: string | undefined = '',
    blogId?: string,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const [posts, totalCount] = await this.postsRepository.findAndCount({
      where: blogId ? { blogId: +blogId } : {},
      order: { [sortBy]: sortDirection },
      skip,
      take: pageSize,
    });

    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post.id.toString());

    // __ASK__ all good and correct?
    const likesRaw = await this.likesRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.user', 'user')
      .where('like.likedEntityId = ANY(:postIds)', { postIds })
      .orderBy('like.updatedAt', 'DESC')
      .select([
        'like.id',
        'like.status',
        'like.likedEntityId',
        'like.userId',
        'like.updatedAt',
        'user.login AS "userLogin"',
      ])
      .getRawMany();

    const likes = likesRaw.map(
      (like) =>
        ({
          id: like.like_id,
          status: like.like_status,
          likedEntityId: like.like_likedEntityId,
          userId: like.like_userId,
          updatedAt: like.like_updatedAt,
          userLogin: like.userLogin,
        }) as JoinedLike,
    );

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) => like.likedEntityId.toString() === postId.toString());
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

    const allLikes = await this.dataSource.query<JoinedLike[]>(
      `
        SELECT l.*, u.login as user_login FROM likes l
        LEFT JOIN users u
        ON l.user_id = u.id
        WHERE liked_entity_id = $1
        ORDER BY updated_at DESC
      `,
      [postId],
    );

    const extendedLikesInfo = getLikesInfo(allLikes, currentUserId);

    return new PostsViewDto({ ...post, extendedLikesInfo });
  }
}
