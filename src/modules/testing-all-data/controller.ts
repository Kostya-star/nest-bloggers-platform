import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../bloggers-platform/blogs/domain/blogs.schema';
import { IPostModel, Post } from '../bloggers-platform/posts/domain/posts.schema';
import { ILikeModel, Like } from '../bloggers-platform/likes/domain/likes.schema';
import { Comment, ICommentModel } from '../bloggers-platform/comments/domain/comments.schema';
import { DataSource } from 'typeorm';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectModel(Blog.name) private BlogModel: IBlogModel,
    @InjectModel(Post.name) private PostModel: IPostModel,
    @InjectModel(Like.name) private LikeModel: ILikeModel,
    @InjectModel(Comment.name) private CommentModel: ICommentModel,

    private dataSource: DataSource,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.dataSource.query(`
        DELETE FROM users
      `);

    await this.dataSource.query(`
        DELETE FROM devices
      `);

    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.LikeModel.deleteMany();
    await this.CommentModel.deleteMany();
  }
}
