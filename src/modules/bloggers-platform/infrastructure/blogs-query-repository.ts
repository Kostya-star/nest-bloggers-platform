import { Injectable } from '@nestjs/common';
import { GetBlogsQueryParams } from '../api/input-dto/get-blogs-query-params';
import { SortDirection } from 'src/core/dto/base-query-params.input.dto';
import { SortOrder } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, IBlogModel } from '../domain/blogs-schema';
import { BlogsViewDto } from '../api/view-dto/blogs-view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: IBlogModel) {}

  async getAllBlogs(query: GetBlogsQueryParams) {
    const {
      pageNumber,
      pageSize,
      searchNameTerm,
      sortBy,
      sortDirection,
      calculateSkip,
    } = query;

    const skip = calculateSkip.call(query);
    const limit = pageSize;
    const sortOptions = {
      [sortBy]: (sortDirection === SortDirection.Asc ? 1 : -1) as SortOrder,
    };

    const search = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: 'i' } }
      : {};

    const blogs = await this.BlogModel.find(search)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalCount = await this.BlogModel.countDocuments(query);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map((b) => new BlogsViewDto(b)),
    };
  }
}
