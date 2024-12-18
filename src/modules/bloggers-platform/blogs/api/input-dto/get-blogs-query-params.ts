import { BaseSortablePaginationParams } from 'src/core/dto/base-query-params.dto';
import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
