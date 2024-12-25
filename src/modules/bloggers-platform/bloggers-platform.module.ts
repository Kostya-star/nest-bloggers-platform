import { Module } from '@nestjs/common';
import { BlogsService } from './blogs/application/blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blogs.schema';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs-query.repository';
import { BlogsCommandsRepository } from './blogs/infrastructure/blogs-commands.repository';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsQueryRepository } from './posts/infrastructure/posts-query.repository';
import { Post, PostSchema } from './posts/domain/posts.schema';
import { Like, LikeSchema } from './likes/domain/likes.schema';
import { PostsController } from './posts/api/posts.controller';
import { PostsCommandsRepository } from './posts/infrastructure/posts-commands.repository';
import { PostsService } from './posts/application/posts.service';
import { Comment, CommentSchema } from './comments/domain/comments.schema';
import { CommentsQueryRepository } from './comments/infrastructure/comments-query.repository';
import { CreatePostCommentUseCase } from './comments/application/use-cases/create-post-comment.usecase';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { CommentsCommandsRepository } from './comments/infrastructure/comments-commands.repository';
import { LikesCommandRepository } from './likes/infrastructure/likes-command.repository';
import { HandleLikeUseCase } from './likes/application/use-cases/handle-like.usecase';

const commands = [CreatePostCommentUseCase, HandleLikeUseCase];
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
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController],
  providers: [...services, ...repos, ...commands],
  exports: [],
})
export class BloggersPlatformModule {}
