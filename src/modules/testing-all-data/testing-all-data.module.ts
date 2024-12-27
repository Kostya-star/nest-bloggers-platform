import { Module } from '@nestjs/common';
import { TestingAllDataController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../bloggers-platform/blogs/domain/blogs.schema';
import { Post, PostSchema } from '../bloggers-platform/posts/domain/posts.schema';
import { Like, LikeSchema } from '../bloggers-platform/likes/domain/likes.schema';
import { User, UserSchema } from '../user-accounts/users/domain/user.schema';
import { Comment, CommentSchema } from '../bloggers-platform/comments/domain/comments.schema';
import { Device, DeviceSchema } from '../user-accounts/devices/domain/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [TestingAllDataController],
  providers: [],
})
export class TestingAllDataModule {}
