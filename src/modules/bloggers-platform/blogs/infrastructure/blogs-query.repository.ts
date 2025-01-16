import { Injectable } from '@nestjs/common';
import { GetBlogsQueryParams } from '../api/input-dto/get-blogs-query-params';
import { BlogsViewDto } from '../api/view-dto/blogs-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blogs.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) {}

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

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs.map((b) => new BlogsViewDto(b)),
    };
  }

  async getBlogById(blogId: number): Promise<BlogsViewDto | null> {
    const blog = await this.blogsRepository.findOne({ where: { id: blogId } });
    return blog ? new BlogsViewDto(blog) : null;
  }
}
