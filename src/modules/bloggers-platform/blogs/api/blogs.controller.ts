import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { BlogsViewDto } from './view-dto/blogs-view-dto';
import { CreateBlogDto } from './input-dto/create-blog.dto';
import { UpdateBlogDto } from './input-dto/update-blog.dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<BasePaginatedView<BlogsViewDto>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId') blogId: string): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  @Post()
  async createBlog(@Body() blog: CreateBlogDto): Promise<BlogsViewDto> {
    const blogId = await this.blogsService.createBlog(blog);
    const newBlog = await this.blogsQueryRepository.getBlogById(
      blogId.toString(),
    );

    if (!newBlog) {
      throw new NotFoundException('blog not found');
    }

    return newBlog;
  }

  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() updates: UpdateBlogDto,
  ): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsService.updateBlog(blogId, updates);
  }

  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsService.deleteBlog(blogId);
  }
}