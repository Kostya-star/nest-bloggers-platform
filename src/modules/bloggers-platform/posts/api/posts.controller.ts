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
import { BaseSortablePaginationParams } from 'src/core/dto/base-query-params.dto';
import { PostsSortBy } from './input.dto/posts-sort-by';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { PostsViewDto } from './view.dto/posts-view-dto';
import { CreatePostDto } from './input.dto/create-post.dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from './input.dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: BaseSortablePaginationParams<PostsSortBy>,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    // TODO. temporarily while no access token
    const userId = '';

    return await this.postsQueryRepository.getAllPosts(query, userId);
  }

  @Get(':id')
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
  async createPost(@Body() post: CreatePostDto): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost(post);
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
