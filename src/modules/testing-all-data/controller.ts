import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../bloggers-platform/blogs/domain/blogs.schema';
import { IPostModel, Post } from '../bloggers-platform/posts/domain/posts.schema';
import { ILikeModel, Like } from '../bloggers-platform/likes/domain/likes.schema';
import { IUserModel, User } from '../user-accounts/users/domain/user.schema';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectModel(Blog.name) private BlogModel: IBlogModel,
    @InjectModel(Post.name) private PostModel: IPostModel,
    @InjectModel(Like.name) private LikeModel: ILikeModel,
    @InjectModel(User.name) private UserModel: IUserModel,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.LikeModel.deleteMany();
    await this.UserModel.deleteMany();
  }
}
