import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { Post } from '../../domain/posts.schema';
import { Like } from 'src/modules/bloggers-platform/likes/domain/likes.schema';
import { LikesBaseViewDto } from 'src/modules/bloggers-platform/likes/api/likes-view.dto';

interface IExtendedLikesInfoView {
  extendedLikesInfo: LikesBaseViewDto & {
    newestLikes: Like[];
  };
}

interface IPostDBWIthExtendedLikesInfo extends Post, IExtendedLikesInfoView {
  _id: MongooseObjtId;
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
    this.id = post._id.toString();
    this.title = post.title;
    this.content = post.content;
    this.shortDescription = post.shortDescription;
    this.blogId = post.blogId.toString();
    this.blogName = post.blogName;
    this.createdAt = post.createdAt;
    this.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: post.extendedLikesInfo.newestLikes.map((like) => ({
        addedAt: like.updatedAt,
        userId: like.userId.toString(),
        login: like.userLogin,
      })),
    };
  }
}
