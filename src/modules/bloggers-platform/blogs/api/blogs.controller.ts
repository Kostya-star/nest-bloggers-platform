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
import { CreatePostInputDto } from '../../posts/api/input-dto/create-post-input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params';
import { PostsViewDto } from '../../posts/api/view-dto/posts-view-dto';
import { CreatePostForBlogInputDto } from './input-dto/create-post-for-blog-input.dto';
import { ObjectIdValidationPipe } from 'src/core/pipes/object-id-validation.pipe';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':blogId')
  async getBlogById(@Param('blogId', ObjectIdValidationPipe) blogId: string): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  @Post()
  async createBlog(@Body() blog: CreateBlogDto): Promise<BlogsViewDto> {
    const blogId = await this.blogsService.createBlog(blog);
    const newBlog = await this.blogsQueryRepository.getBlogById(blogId.toString());

    if (!newBlog) {
      throw new NotFoundException('blog not found');
    }

    return newBlog;
  }

  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
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
  async deleteBlog(@Param('blogId', ObjectIdValidationPipe) blogId: string): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsService.deleteBlog(blogId);
  }

  @Post(':blogId/posts')
  async createPostForBlog(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Body() post: CreatePostForBlogInputDto,
  ): Promise<PostsViewDto> {
    const postBody: CreatePostInputDto = {
      ...post,
      blogId,
    };

    const postId = await this.postsService.createPost(postBody);
    const newPost = await this.postsQueryRepository.getPostById(postId.toString());

    if (!newPost) {
      throw new NotFoundException('post not found');
    }

    return newPost;
  }

  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    // TODO. temporarily while no access token
    const userId = '';

    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return await this.postsQueryRepository.getAllPosts(query, userId, blogId);
  }
}
