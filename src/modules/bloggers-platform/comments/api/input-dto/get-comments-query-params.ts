import { BaseSortablePaginationParams } from 'src/core/dto/base-query-params.dto';
import { CommentsSortBy } from './comments-sort-by';

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  sortBy = CommentsSortBy.CreatedAt;
}
