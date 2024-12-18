import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SortOrder } from 'mongoose';

class PaginationParams {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageNumber: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number = 10;
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export abstract class BaseSortablePaginationParams<T extends string> extends PaginationParams {
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.Desc;

  @IsOptional()
  abstract sortBy: T;

  processQueryParams() {
    const skip = (this.pageNumber - 1) * this.pageSize;
    const limit = this.pageSize;
    const sortOptions = {
      [this.sortBy]: (this.sortDirection === SortDirection.Asc ? 1 : -1) as SortOrder,
    };

    return { skip, limit, sortOptions };
  }
}
