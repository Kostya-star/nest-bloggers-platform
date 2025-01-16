import { Injectable } from '@nestjs/common';
import { getLikesInfo } from '../../common/utils/get-likes-info';
import { PostsViewDto } from '../api/view-dto/posts-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { Post } from '../domain/posts.schema-typeorm';
import { Like } from '../../likes/domain/likes.schema-typeorm';
import { JoinedLike } from '../../common/dto/joined-like';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    currentUserId: string | undefined = '',
    blogId?: number,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const [posts, totalCount] = await this.postsRepository.findAndCount({
      where: blogId ? { blogId } : {},
      order: { [sortBy]: sortDirection },
      skip,
      take: pageSize,
    });

    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post.id.toString());

    const likes = await this.getJoinedPostsLikes('like.likedEntityId = ANY(:postIds)', { postIds });

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

  async getPostById(postId: number, currentUserId: string | undefined = ''): Promise<PostsViewDto | null> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });

    if (!post) return null;

    const likes = await this.getJoinedPostsLikes('like.likedEntityId = :postId', { postId });

    const extendedLikesInfo = getLikesInfo(likes, currentUserId);

    return new PostsViewDto({ ...post, extendedLikesInfo });
  }

  async getJoinedPostsLikes(whereClause: string, whereParams: ObjectLiteral | ObjectLiteral[]): Promise<JoinedLike[]> {
    const likesRaw = await this.likesRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.user', 'user')
      .where(whereClause, whereParams)
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

    return likesRaw.map(
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
  }
}
