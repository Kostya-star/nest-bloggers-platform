import { Injectable } from '@nestjs/common';
import { BlogsCommandsRepository } from '../infrastructure/blogs-commands.repository';

@Injectable()
export class BlogsService {
  constructor(private blogsCommandsRepository: BlogsCommandsRepository) {}

  async createBlog(blog: any): Promise<any> {
    return await this.blogsCommandsRepository.createBlog(blog);
  }
}
