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
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from './input.dto/update-post.dto';
import { GetPostsQueryParams } from './input.dto/get-posts-query-params';
import { GetCommentsQueryParams } from '../../comments/api/input.dto/get-comments-query-params';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query.repository';
import { CommentsViewDto } from '../../comments/api/view.dto/comments-view.dto';
import { CreatePostInputDto } from './input.dto/create-post-input.dto';
import { ObjectIdValidationPipe } from 'src/core/pipes/object-id-validation.pipe';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() query: GetPostsQueryParams): Promise<BasePaginatedView<PostsViewDto>> {
    // TODO. temporarily while no access token
    const userId = '';

    return await this.postsQueryRepository.getAllPosts(query, userId);
  }

  @Get(':postId')
  async getPostById(@Param('postId', ObjectIdValidationPipe) postId: string): Promise<PostsViewDto> {
    // TODO. temporarily while no access token
    const userId = '';

    const post = await this.postsQueryRepository.getPostById(postId, userId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  @Post()
  async createPost(@Body() post: CreatePostInputDto): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost(post);

    const newPost = await this.postsQueryRepository.getPostById(postId.toString());

    if (!newPost) {
      throw new NotFoundException('post not found');
    }

    return newPost;
  }

  @Put(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
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
  async deletePost(@Param('postId', ObjectIdValidationPipe) postId: string): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.deletePost(postId);
  }

  @Get(':postId/comments')
  async getCommentsOfPost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() query: GetCommentsQueryParams,
  ): Promise<BasePaginatedView<CommentsViewDto>> {
    // TODO. temporarily while no access token
    const userId = '';

    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return await this.commentsQueryRepository.getCommentsForPost(query, postId, userId);
  }
}
