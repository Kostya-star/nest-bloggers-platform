import { Injectable } from '@nestjs/common';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { CreatePostDto } from '../api/input.dto/create-post.dto';
import { PostsCommandsRepository } from '../infrastructure/posts-commands.repository';
import { UpdatePostDto } from '../api/input.dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private postsCommandsRepository: PostsCommandsRepository) {}

  async createPost(post: CreatePostDto): Promise<MongooseObjtId> {
    return await this.postsCommandsRepository.createPost(post);
  }

  async updatePost(postId: string, updates: UpdatePostDto): Promise<void> {
    return await this.postsCommandsRepository.updatePost(postId, updates);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsCommandsRepository.deletePost(postId);
  }
}
