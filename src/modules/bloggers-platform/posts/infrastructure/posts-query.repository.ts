import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPostModel, Post } from '../domain/posts.schema';
import { ILikeModel, Like } from '../../likes/domain/likes.schema';
import { getLikesInfo } from '../../utils/get-likes-info';
import { PostsViewDto } from '../api/view.dto/posts-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { GetPostsQueryParams } from '../api/input.dto/get-posts-query-params';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: IPostModel,
    @InjectModel(Like.name) private LikeModel: ILikeModel,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    currentUserId?: string,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const { pageNumber: page, pageSize } = query;

    const { sortOptions, limit, skip } = query.processQueryParams();

    const posts = await this.PostModel.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await this.PostModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postIds = posts.map((post) => post._id);
    const likes = await this.LikeModel.find({ likedEntityId: { $in: postIds } })
      .sort({ updatedAt: -1 })
      .lean();

    const postsLikesInfo = postIds.map((postId) => {
      const allPostLikes = likes.filter((like) =>
        like.likedEntityId.equals(postId),
      );
      const likesInfo = getLikesInfo(allPostLikes, currentUserId);

      return { postId, ...likesInfo };
    });

    const finalItems = posts.map((basePost) => {
      const { likesCount, dislikesCount, myStatus, newestLikes } =
        postsLikesInfo.find((post) => post.postId.equals(basePost._id))!;
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

  async getPostById(
    postId: string,
    currentUserId?: string,
  ): Promise<PostsViewDto | null> {
    const post = await this.PostModel.findOne({ _id: postId }).lean();
    if (!post) return null;

    const allLikes = await this.LikeModel.find({ likedEntityId: postId })
      .sort({ updatedAt: -1 })
      .lean();

    const extendedLikesInfo = getLikesInfo(allLikes, currentUserId);

    return new PostsViewDto({ ...post, extendedLikesInfo });
  }
}
