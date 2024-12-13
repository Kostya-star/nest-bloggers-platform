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
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { PostsViewDto } from './view.dto/posts-view-dto';
import { CreatePostDto } from './input.dto/create-post.dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from './input.dto/update-post.dto';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs-query.repository';
import { GetPostsQueryParams } from './input.dto/get-posts-query-params';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    // TODO. temporarily while no access token
    const userId = '';

    return await this.postsQueryRepository.getAllPosts(query, userId);
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string): Promise<PostsViewDto> {
    // TODO. temporarily while no access token
    const userId = '';

    const post = await this.postsQueryRepository.getPostById(postId, userId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  @Post()
  async createPost(
    @Body() post: Omit<CreatePostDto, 'blogName'>,
  ): Promise<PostsViewDto> {
    const blog = await this.blogsQueryRepository.getBlogById(post.blogId);

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const postPayload: CreatePostDto = {
      ...post,
      blogName: blog.name,
    };

    const postId = await this.postsService.createPost(postPayload);

    const newPost = await this.postsQueryRepository.getPostById(
      postId.toString(),
    );

    if (!newPost) {
      throw new NotFoundException('post not found');
    }

    return newPost;
  }

  @Put(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updates: UpdatePostDto,
  ): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.updatePost(postId, updates);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId') postId: string): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.deletePost(postId);
  }
}
