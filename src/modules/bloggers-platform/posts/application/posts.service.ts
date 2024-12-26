import { Injectable, NotFoundException } from '@nestjs/common';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { PostsCommandsRepository } from '../infrastructure/posts-commands.repository';
import { UpdatePostDto } from '../api/input-dto/update-post.dto';
import { BlogsCommandsRepository } from '../../blogs/infrastructure/blogs-commands.repository';
import { CreatePostDto } from '../api/input-dto/create-post.dto';
import { CreatePostInputDto } from '../api/input-dto/create-post-input.dto';

@Injectable()
export class PostsService {
  constructor(
    private postsCommandsRepository: PostsCommandsRepository,
    private blogsCommandsRepository: BlogsCommandsRepository,
  ) {}

  async createPost(post: CreatePostInputDto): Promise<MongooseObjtId> {
    const blog = await this.blogsCommandsRepository.getBlogById(post.blogId);

    // this only checks for blog presence via /blod/:blogId/posts.
    // if the blogId is comming in body, the 404 validation takes place in the validation class dto
    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const postBody: CreatePostDto = {
      ...post,
      blogName: blog.name,
    };

    return await this.postsCommandsRepository.createPost(postBody);
  }

  async updatePost(postId: string, updates: UpdatePostDto): Promise<void> {
    return await this.postsCommandsRepository.updatePost(postId, updates);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsCommandsRepository.deletePost(postId);
  }
}
