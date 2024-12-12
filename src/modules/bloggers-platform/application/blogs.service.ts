import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsCommandsRepository } from '../infrastructure/blogs-commands.repository';
import { CreateBlogDto } from '../api/input-dto/create-blog.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateBlogDto } from '../api/input-dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private blogsCommandsRepository: BlogsCommandsRepository) {}

  async createBlog(blog: CreateBlogDto): Promise<MongooseObjtId> {
    return await this.blogsCommandsRepository.createBlog(blog);
  }

  async updateBlog(
    blogId: MongooseObjtId,
    updates: UpdateBlogDto,
  ): Promise<void> {
    const blog = await this.blogsCommandsRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return await this.blogsCommandsRepository.updateBlog(blogId, updates);
  }

  async deleteBlog(blogId: MongooseObjtId): Promise<void> {
    const blog = await this.blogsCommandsRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsCommandsRepository.deleteBlog(blogId);
  }
}
