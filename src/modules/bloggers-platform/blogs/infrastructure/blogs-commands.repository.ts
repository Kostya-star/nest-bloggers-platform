import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/input-dto/create-blog.dto';
import { UpdateBlogDto } from '../api/input-dto/update-blog.dto';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blogs.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsCommandsRepository {
  constructor(@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) {}

  async getBlogById(blogId: number): Promise<Blog | null> {
    return await this.blogsRepository.findOne({ where: { id: blogId } });
  }

  async createBlog(newBlog: CreateBlogDto): Promise<number> {
    const blog = this.blogsRepository.create({
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      isMembership: false,
    });

    const savedBlog = await this.blogsRepository.save(blog);
    return savedBlog.id;
  }

  async updateBlog(blogId: string, updates: UpdateBlogDto): Promise<void> {
    await this.blogsRepository.update(blogId, updates);
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.blogsRepository.delete(blogId);
  }
}
