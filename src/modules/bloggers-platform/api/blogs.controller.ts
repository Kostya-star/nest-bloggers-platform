import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
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
  @Post()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<IBasePaginatedView<BlogsViewDto>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }
}
