import { Injectable } from '@nestjs/common';
import { GetBlogsQueryParams } from '../api/input-dto/get-blogs-query-params';
import { BlogsViewDto } from '../api/view-dto/blogs-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { DataSource, Repository } from 'typeorm';
import { Blog } from '../domain/blogs.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
  ) {}

  async getAllBlogs(query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
    const { pageNumber: page, pageSize, searchNameTerm, sortBy, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const [blogs, totalCount] = await this.blogsRepository
      .createQueryBuilder('blog')
      .where('blog.name ILIKE :search', { search: `%${searchNameTerm || ''}%` })
      .orderBy(`blog.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    // const blogs = await this.dataSource.query<Blog[]>(
    //   `
    //   SELECT * FROM blogs
    //   WHERE name ILIKE '%' || $1 || '%'
    //   ORDER BY ${sortBy} ${sortDirection}
    //   LIMIT $2 OFFSET $3
    //   `,
    //   [searchNameTerm || '', pageSize, offset],
    // );

    // const totalCountRes = await this.dataSource.query<{ count: string }[]>(
    //   `
    //   SELECT COUNT(*) FROM blogs
    //   WHERE name ILIKE '%' || $1 || '%'
    //   `,
    //   [searchNameTerm || ''],
    // );

    // const totalCount = parseInt(totalCountRes[0].count);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs.map((b) => new BlogsViewDto(b)),
    };
  }

  async getBlogById(blogId: string): Promise<BlogsViewDto | null> {
    const blog = await this.dataSource.query<Blog[]>(
      `
        SELECT * FROM blogs
        WHERE id = $1 
      `,
      [blogId],
    );

    return blog[0] ? new BlogsViewDto(blog[0]) : null;
  }
}
