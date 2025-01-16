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
  UseGuards,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { PostsViewDto } from './view-dto/posts-view-dto';
import { PostsService } from '../application/posts.service';
import { UpdatePostDto } from './input-dto/update-post.dto';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params';
import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query.repository';
import { CommentsViewDto } from '../../comments/api/view-dto/comments-view.dto';
import { CreatePostInputDto } from './input-dto/create-post-input.dto';
import { ObjectIdValidationPipe } from 'src/core/pipes/object-id-validation.pipe';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CreatePostCommentInputDto } from './input-dto/create-post-comment-input.dto';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommentCommand } from '../../comments/application/use-cases/create-post-comment.usecase';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { AuthGuard } from '@nestjs/passport';
import { UsersQueryRepository } from 'src/modules/user-accounts/users/infrastructure/users-query.repository';
import { HandleLikeCommand } from '../../likes/application/use-cases/handle-like.usecase';
import { LikePostStatusInputDto } from './input-dto/like-post-status-input.dto';
import { JwtAuthOptionalGuard } from 'src/core/guards/jwt-auth-optional.guard';
import { ExtractUserFromRequestIfExist } from 'src/core/decorators/extract-user-from-req-if-exist.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(JwtAuthOptionalGuard)
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
    @ExtractUserFromRequestIfExist() user: UserContext | null,
  ): Promise<BasePaginatedView<PostsViewDto>> {
    return await this.postsQueryRepository.getAllPosts(query, user?.userId);
  }

  @Get(':postId')
  @UseGuards(JwtAuthOptionalGuard)
  async getPostById(
    @Param('postId') postId: string,
    @ExtractUserFromRequestIfExist() user: UserContext | null,
  ): Promise<PostsViewDto> {
    const post = await this.postsQueryRepository.getPostById(+postId, user?.userId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() post: CreatePostInputDto): Promise<PostsViewDto> {
    const postId = await this.postsService.createPost(post);

    const newPost = await this.postsQueryRepository.getPostById(+postId);

    if (!newPost) {
      throw new NotFoundException('post not found');
    }

    return newPost;
  }

  @Put(':postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() updates: UpdatePostDto,
  ): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.updatePost(postId, updates);
  }

  @Delete(':postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId', ObjectIdValidationPipe) postId: string): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    await this.postsService.deletePost(postId);
  }

  @Post(':postId/comments')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() commBody: CreatePostCommentInputDto,
    @ExtractUserFromRequest() user: UserContext,
  ): Promise<CommentsViewDto> {
    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    const commentId = await this.commandBus.execute<CreatePostCommentCommand, string>(
      // @ts-ignore
      new CreatePostCommentCommand(postId, commBody.content, user.userId),
    );
    const comment = await this.commentsQueryRepository.getCommentById(commentId, user.userId);

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return comment;
  }

  @Get(':postId/comments')
  @UseGuards(JwtAuthOptionalGuard)
  async getCommentsOfPost(
    @Param('postId') postId: string,
    @Query() query: GetCommentsQueryParams,
    @ExtractUserFromRequestIfExist() user: UserContext | null,
  ): Promise<BasePaginatedView<CommentsViewDto>> {
    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return await this.commentsQueryRepository.getCommentsForPost(query, postId, user?.userId);
  }

  @Put(':postId/like-status')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async likePost(
    @Param('postId') postId: string,
    @Body() body: LikePostStatusInputDto,
    @ExtractUserFromRequest() user: UserContext,
  ): Promise<void> {
    const post = await this.postsQueryRepository.getPostById(+postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    // @ts-ignore
    await this.commandBus.execute<HandleLikeCommand, void>(new HandleLikeCommand(postId, body.likeStatus, user.userId));
  }
}
