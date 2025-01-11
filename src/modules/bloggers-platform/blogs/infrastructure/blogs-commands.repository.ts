import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/input-dto/create-blog.dto';
import { UpdateBlogDto } from '../api/input-dto/update-blog.dto';
import { DataSource } from 'typeorm';
import { Blog } from '../domain/blogs.schema-typeorm';

@Injectable()
export class BlogsCommandsRepository {
  constructor(private dataSource: DataSource) {}

  async getBlogById(blogId: string): Promise<Blog | null> {
    const blog = await this.dataSource.query<Blog[]>(
      `
        SELECT * FROM blogs
        WHERE id = $1 
      `,
      [blogId],
    );
    return blog[0] ?? null;
  }

  async createBlog({ name, description, websiteUrl }: CreateBlogDto): Promise<string> {
    const blog = await this.dataSource.query<Blog[]>(
      `
        INSERT INTO blogs (
          name, description, website_url
        )
        VALUES($1, $2, $3)
        RETURNING *;
      `,
      [name, description, websiteUrl],
    );

    return blog[0].id.toString();
  }

  async updateBlog(blogId: string, updates: UpdateBlogDto): Promise<void> {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys
      .map((key, index) => {
        if (key === 'websiteUrl') return `website_url = $${index + 2}`;
        return `${key} = $${index + 2}`;
      })
      .join(', ');

    await this.dataSource.query(
      `
        UPDATE blogs
        SET ${setClause}
        WHERE id = $1
      `,
      [blogId, ...values],
    );
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.dataSource.query(
      `
        DELETE FROM blogs
        WHERE id = $1
      `,
      [blogId],
    );
  }
}
