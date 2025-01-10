import { LikesBaseViewDto } from 'src/modules/bloggers-platform/likes/api/likes-view.dto';
import { Like } from 'src/modules/bloggers-platform/likes/domain/likes.schema-typeorm';
import { Post } from '../../domain/posts.schema-typeorm';

interface IExtendedLikesInfoView {
  extendedLikesInfo: LikesBaseViewDto & {
    newestLikes: Like[];
  };
}

interface IPostDBWIthExtendedLikesInfo extends Post, IExtendedLikesInfoView {
  // _id: MongooseObjtId;
}

export class PostsViewDto {
  id: string;
  title: string;
  content: string;
  shortDescription: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: LikesBaseViewDto & {
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string;
    }[];
  };

  constructor(post: IPostDBWIthExtendedLikesInfo) {
    this.id = post.id.toString();
    this.title = post.title;
    this.content = post.content;
    this.shortDescription = post.short_description;
    this.blogId = post.blog_id.toString();
    this.blogName = post.blog_name;
    this.createdAt = post.created_at;
    this.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: post.extendedLikesInfo.newestLikes.map((like) => ({
        addedAt: like.updated_at,
        userId: like.user_id.toString(),
        login: like.user_login,
      })),
    };
  }
}
