import { Injectable } from '@nestjs/common';
import { BlogsCommandsRepository } from '../infrastructure/blogs-commands.repository';
import { CreateBlogDto } from '../api/input-dto/create-blog.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateBlogDto } from '../api/input-dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private blogsCommandsRepository: BlogsCommandsRepository) {}

  async createBlog(blog: CreateBlogDto): Promise<string> {
    return await this.blogsCommandsRepository.createBlog(blog);
  }

  async updateBlog(blogId: string, updates: UpdateBlogDto): Promise<void> {
    return await this.blogsCommandsRepository.updateBlog(blogId, updates);
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.blogsCommandsRepository.deleteBlog(blogId);
  }
}
