import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../bloggers-platform/domain/blogs.schema';

@Controller('testing/all-data')
export class TestingAllDataController {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}

  @Delete()
  async deleteAllData(): Promise<void> {
    await this.BlogModel.deleteMany();
  }
}
