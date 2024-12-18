import { Injectable } from '@nestjs/common';
import { GetBlogsQueryParams } from '../api/input-dto/get-blogs-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../domain/blogs.schema';
import { BlogsViewDto } from '../api/view-dto/blogs-view-dto';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}

  async getAllBlogs(query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
    const { pageNumber: page, pageSize, searchNameTerm } = query;

    const { sortOptions, limit, skip } = query.processQueryParams();

    const search = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

    const blogs = await this.BlogModel.find(search).sort(sortOptions).skip(skip).limit(limit);

    const totalCount = await this.BlogModel.countDocuments(search);
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
    const blog = await this.BlogModel.findOne({ _id: blogId });
    return blog ? new BlogsViewDto(blog) : null;
  }
}
