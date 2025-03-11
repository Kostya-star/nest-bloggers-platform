import { BaseSortablePaginationParams } from 'src/core/dto/base-query-params.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QuestionsSortBy } from './questions-sort-by';
import { QuestionPublishStatus } from './questions-publish-status';

export class GetQuestionsQueryParams extends BaseSortablePaginationParams<QuestionsSortBy> {
  @IsEnum(QuestionsSortBy)
  sortBy: QuestionsSortBy = QuestionsSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  // ASK is this query optional or not? according to TT its not
  bodySearchTerm: string | null = null;

  @IsEnum(QuestionPublishStatus)
  publishedStatus: QuestionPublishStatus = QuestionPublishStatus.All;
}
