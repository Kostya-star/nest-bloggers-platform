import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../api/input-dto/update-post.dto';
import { CreatePostDto } from '../api/input-dto/create-post.dto';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/posts.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsCommandsRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  // async getPostById(postId: string): Promise<IPostDocument | null> {
  //   return await this.PostModel.findOne({ _id: postId });
  // }

  async createPost(newPost: CreatePostDto): Promise<number> {
    const post = this.postsRepository.create({
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: +newPost.blogId,
      blogName: newPost.blogName,
    });

    const savedPost = await this.postsRepository.save(post);
    return savedPost.id;
  }

  async updatePost(postId: string, updates: UpdatePostDto): Promise<void> {
    await this.postsRepository.update(postId, updates);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsRepository.delete(postId);
  }
}
