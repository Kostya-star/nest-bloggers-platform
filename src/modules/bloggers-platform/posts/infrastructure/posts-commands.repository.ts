import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from '../api/input-dto/update-post.dto';
import { CreatePostDto } from '../api/input-dto/create-post.dto';
import { DataSource } from 'typeorm';
import { Post } from '../domain/posts.schema-typeorm';

@Injectable()
export class PostsCommandsRepository {
  constructor(private dataSource: DataSource) {}

  // async getPostById(postId: string): Promise<IPostDocument | null> {
  //   return await this.PostModel.findOne({ _id: postId });
  // }

  async createPost({ title, shortDescription, content, blogName, blogId }: CreatePostDto): Promise<string> {
    const post = await this.dataSource.query<Post[]>(
      `
        INSERT INTO posts (
          title, short_description, content, blog_id, blog_name
        )
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [title, shortDescription, content, blogId, blogName],
    );

    return post[0].id.toString();
  }

  async updatePost(postId: string, updates: UpdatePostDto): Promise<void> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys
      .map((key, index) => {
        if (key === 'shortDescription') key = 'short_description';
        return `${key} = $${index + 2}`;
      })
      .join(', ');

    await this.dataSource.query(
      `
        UPDATE posts
        SET ${setClause}
        WHERE id = $1
      `,
      [postId, ...values],
    );
  }

  async deletePost(postId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM posts
        WHERE id = $1
      `,
      [postId],
    );
  }
}
