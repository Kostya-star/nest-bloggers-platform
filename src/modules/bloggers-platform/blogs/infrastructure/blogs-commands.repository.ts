import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogDocument, IBlogModel } from '../domain/blogs.schema';
import { CreateBlogDto } from '../api/input-dto/create-blog.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateBlogDto } from '../api/input-dto/update-blog.dto';

@Injectable()
export class BlogsCommandsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}

  // async getBlogById(blogId: string): Promise<IBlogDocument | null> {
  //   return await this.BlogModel.findOne({ _id: blogId });
  // }

  async createBlog(newBlog: CreateBlogDto): Promise<MongooseObjtId> {
    const blog = await this.BlogModel.create(newBlog);
    return blog._id;
  }

  async updateBlog(blogId: string, updates: UpdateBlogDto): Promise<void> {
    await this.BlogModel.updateOne({ _id: blogId }, updates);
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.BlogModel.deleteOne({ _id: blogId });
  }
}
