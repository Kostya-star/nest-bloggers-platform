import { Module } from '@nestjs/common';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs-query.repository';
import { BlogsCommandsRepository } from './blogs/infrastructure/blogs-commands.repository';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsQueryRepository } from './posts/infrastructure/posts-query.repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsCommandsRepository } from './posts/infrastructure/posts-commands.repository';
import { PostsService } from './posts/application/posts.service';
import { CommentsQueryRepository } from './comments/infrastructure/comments-query.repository';
import { CreatePostCommentUseCase } from './comments/application/use-cases/create-post-comment.usecase';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { CommentsCommandsRepository } from './comments/infrastructure/comments-commands.repository';
import { LikesCommandRepository } from './likes/infrastructure/likes-command.repository';
import { HandleLikeUseCase } from './likes/application/use-cases/handle-like.usecase';
import { CommnetsController } from './comments/api/comments.controller';
import { UpdateCommentUseCase } from './comments/application/use-cases/update-comment.usecase';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete-comment.usecase';
import { IsBlogIdValidAndExist } from './posts/api/validation/is-blogId-valid-and-exist-custom-validator.constraint';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/blogs.schema-typeorm';
import { Post } from './posts/domain/posts.schema-typeorm';
import { Like } from './likes/domain/likes.schema-typeorm';
import { Comment } from './comments/domain/comments.schema-typeorm';

const commands = [CreatePostCommentUseCase, HandleLikeUseCase, UpdateCommentUseCase, DeleteCommentUseCase];
const repos = [
  BlogsCommandsRepository,
  BlogsQueryRepository,
  PostsQueryRepository,
  PostsCommandsRepository,
  CommentsQueryRepository,
  CommentsCommandsRepository,
  LikesCommandRepository,
];
const services = [BlogsService, PostsService];

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: Post.name, schema: PostSchema },
    //   { name: Like.name, schema: LikeSchema },
    //   { name: Comment.name, schema: CommentSchema },
    // ]),
    TypeOrmModule.forFeature([Blog, Post, Like, Comment]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommnetsController],
  providers: [...services, ...repos, ...commands, IsBlogIdValidAndExist],
  exports: [],
})
export class BloggersPlatformModule {}
