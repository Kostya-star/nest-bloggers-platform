import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { IBasePaginatedView } from 'src/core/types/base-paginated-entity-view';
import { BlogsViewDto } from './view-dto/blogs-view-dto';
import { CreateBlogDto } from './input-dto/create-blog.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UpdateBlogDto } from './input-dto/update-blog.dto';
import { HTTP_STATUS_CODES } from 'src/core/http-status-codes';

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
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':blogId')
  async getBlogById(
    @Param('blogId') blogId: MongooseObjtId,
  ): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  @Post()
  async createBlog(@Body() blog: CreateBlogDto): Promise<BlogsViewDto | null> {
    const blogId = await this.blogsService.createBlog(blog);
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @Put(':blogId')
  @HttpCode(HTTP_STATUS_CODES.NO_CONTENT_204)
  async updateBlog(
    @Param('blogId') blogId: MongooseObjtId,
    @Body() blog: UpdateBlogDto,
  ): Promise<void> {
    await this.blogsService.updateBlog(blogId, blog);
  }

  @Delete(':blogId')
  @HttpCode(HTTP_STATUS_CODES.NO_CONTENT_204)
  async deleteBlog(@Param('blogId') blogId: MongooseObjtId): Promise<void> {
    await this.blogsService.deleteBlog(blogId);
  }
}
