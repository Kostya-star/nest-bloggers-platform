import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { IBasePaginatedView } from 'src/core/types/base-paginated-entity-view';
import { BlogsViewDto } from './view-dto/blogs-view-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<IBasePaginatedView<BlogsViewDto>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId') blogId: string,
  ): Promise<BlogsViewDto | null> {
    return this.blogsQueryRepository.getBlogById(blogId);
  }

  @Post()
  async createBlog(
    @Body() blog: any,
  ): Promise<BlogsViewDto | null> {
    const blogId = await this.blogsService.createBlog(blog);
    return this.blogsQueryRepository.getBlogById(blogId);
  }
}
