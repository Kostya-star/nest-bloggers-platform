import { BaseSortablePaginationParams } from 'src/core/dto/base-query-params.dto';
import { UsersSortBy } from './users-sort-by';

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  sortBy = UsersSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
