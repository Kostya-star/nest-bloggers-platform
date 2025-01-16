import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
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
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { JwtAuthOptionalGuard } from 'src/core/guards/jwt-auth-optional.guard';
import { ExtractUserFromRequestIfExist } from 'src/core/decorators/extract-user-from-req-if-exist.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { UpdatePostDto } from '../../posts/api/input-dto/update-post.dto';
import { UpdatePostForBlogInputDto } from './input-dto/update-post-for-blog-input.dto';

@Controller()
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs')
  async SAgetAllBlogs(@Query() query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get('blogs')
  async getAllBlogs(@Query() query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get('blogs/:blogId')
  async getBlogById(@Param('blogId') blogId: string): Promise<BlogsViewDto> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return blog;
  }

  @UseGuards(BasicAuthGuard)
  @Post('sa/blogs')
  async createBlog(@Body() blog: CreateBlogDto): Promise<BlogsViewDto> {
    const blogId = await this.blogsService.createBlog(blog);
    const newBlog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!newBlog) {
      throw new NotFoundException('blog not found');
    }

    return newBlog;
  }

  @Put('sa/blogs/:blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('blogId') blogId: string, @Body() updates: UpdateBlogDto): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsService.updateBlog(blogId, updates);
  }

  @Delete('sa/blogs/:blogId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    await this.blogsService.deleteBlog(blogId);
  }

  @Post('sa/blogs/:blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('blogId') blogId: string,
    @Body() post: CreatePostForBlogInputDto,
  ): Promise<PostsViewDto> {
    const postBody: CreatePostInputDto = {
      ...post,
      blogId,
    };

    const postId = await this.postsService.createPost(postBody);
    const newPost = await this.postsQueryRepository.getPostById(postId);

    if (!newPost) {
      throw new NotFoundException('post not found');
    }

    return newPost;
  }

  @UseGuards(BasicAuthGuard)
  @Get('sa/blogs/:blogId/posts')
  @UseGuards(JwtAuthOptionalGuard)
  async SAgetPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExist() user: UserContext | null,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return await this.postsQueryRepository.getAllPosts(query, user?.userId, +blogId);
  }

  @Get('blogs/:blogId/posts')
  @UseGuards(JwtAuthOptionalGuard)
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExist() user: UserContext | null,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    return await this.postsQueryRepository.getAllPosts(query, user?.userId, +blogId);
  }

  @Put('sa/blogs/:blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostForBlog(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updates: UpdatePostForBlogInputDto,
  ): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.updatePost(postId, updates);
  }

  @Delete('sa/blogs/:blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostForBlog(@Param('blogId') blogId: string, @Param('postId') postId: string): Promise<void> {
    const blog = await this.blogsQueryRepository.getBlogById(+blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.deletePost(postId);
  }
}
