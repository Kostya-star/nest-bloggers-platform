import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../domain/question.schema';
import { Repository } from 'typeorm';
import { QuestionsViewDto } from '../api/view-dto/questions-view.dto';
import { GetQuestionsQueryParams } from '../api/input-dto/get-questions-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { QuestionPublishStatus } from '../api/input-dto/questions-publish-status';

@Injectable()
export class QuestionsQueryRepository {
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>) {}

  async getAllQuestions(query: GetQuestionsQueryParams): Promise<BasePaginatedView<QuestionsViewDto>> {
    const { pageNumber: page, pageSize, bodySearchTerm, publishedStatus, sortBy, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const mappedPublishedStatus =
      publishedStatus === QuestionPublishStatus.All ? null : publishedStatus === QuestionPublishStatus.Published;

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.body ILIKE :search', { search: `%${bodySearchTerm || ''}%` });

    if (mappedPublishedStatus !== null) {
      queryBuilder.andWhere('question.published = :published', { published: mappedPublishedStatus });
    }

    const [questions, totalCount] = await queryBuilder
      .orderBy(`question.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: questions.map((b) => new QuestionsViewDto(b)),
    };
  }

  async getQuestionById(questionId: number): Promise<QuestionsViewDto | null> {
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    return question ? new QuestionsViewDto(question) : null;
  }
}
