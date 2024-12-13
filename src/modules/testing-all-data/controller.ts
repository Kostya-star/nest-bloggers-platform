import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../bloggers-platform/blogs/domain/blogs.schema';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<void> {
    await this.BlogModel.deleteMany();
  }
}
