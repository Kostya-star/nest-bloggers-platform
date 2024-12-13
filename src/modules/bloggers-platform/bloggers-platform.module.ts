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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsCommandsRepository,
    BlogsQueryRepository,
    PostsQueryRepository,
    PostsCommandsRepository,
    PostsService,
  ],
  exports: [],
})
export class BloggersPlatformModule {}
