import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../domain/blogs.schema';

@Injectable()
export class BlogsCommandsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}
  
  async createBlog(newBlog: any): Promise<any> {
    const blog = await this.BlogModel.create(newBlog);
    return blog._id;
  }
}
