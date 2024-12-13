import { Module } from '@nestjs/common';
import { TestingAllDataController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../bloggers-platform/blogs/domain/blogs.schema';
import {
  Post,
  PostSchema,
} from '../bloggers-platform/posts/domain/posts.schema';
import {
  Like,
  LikeSchema,
} from '../bloggers-platform/likes/domain/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  controllers: [TestingAllDataController],
  providers: [],
})
export class TestingAllDataModule {}
