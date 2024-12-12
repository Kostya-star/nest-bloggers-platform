import { Type } from 'class-transformer';
import { SortOrder } from 'mongoose';

class PaginationParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export abstract class BaseSortablePaginationParams<
  T extends string,
> extends PaginationParams {
  sortDirection: SortDirection = SortDirection.Desc;
  abstract sortBy: T;

  processQueryParams() {
    const skip = (this.pageNumber - 1) * this.pageSize;
    const limit = this.pageSize;
    const sortOptions = {
      [this.sortBy]: (this.sortDirection === SortDirection.Asc
        ? 1
        : -1) as SortOrder,
    };

    return { skip, limit, sortOptions };
  }
}
