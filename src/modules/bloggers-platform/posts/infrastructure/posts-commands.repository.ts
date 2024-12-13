import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { IPostModel, Post } from '../domain/posts.schema';
import { CreatePostDto } from '../api/input.dto/create-post.dto';
import { UpdatePostDto } from '../api/input.dto/update-post.dto';

@Injectable()
export class PostsCommandsRepository {
  constructor(@InjectModel(Post.name) private PostModel: IPostModel) {}

  // async getBlogById(blogId: string): Promise<IBlogDocument | null> {
  //   return await this.PostModel.findOne({ _id: blogId });
  // }

  async createPost(newPost: CreatePostDto): Promise<MongooseObjtId> {
    const post = await this.PostModel.create(newPost);
    return post._id;
  }

  async updatePost(postId: string, updates: UpdatePostDto): Promise<void> {
    await this.PostModel.updateOne({ _id: postId }, updates);
  }

  async deletePost(postId: string): Promise<void> {
    await this.PostModel.deleteOne({ _id: postId });
  }
}
