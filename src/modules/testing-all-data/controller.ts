import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, ICommentModel } from '../bloggers-platform/comments/domain/comments.schema';
import { DataSource } from 'typeorm';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(
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

    await this.dataSource.query(`
        DELETE FROM blogs
      `);

    await this.dataSource.query(`
        DELETE FROM posts
      `);

    await this.dataSource.query(`
        DELETE FROM likes
      `);

    await this.CommentModel.deleteMany();
  }
}
