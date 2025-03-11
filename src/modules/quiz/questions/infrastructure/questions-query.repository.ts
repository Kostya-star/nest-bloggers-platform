import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../domain/question.schema';
import { Repository } from 'typeorm';
import { QuestionsViewDto } from '../api/view-dto/questions-view.dto';

@Injectable()
export class QuestionsQueryRepository {
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>) {}

  // async getAllQuestions(query: GetBlogsQueryParams): Promise<BasePaginatedView<BlogsViewDto>> {
  //   const { pageNumber: page, pageSize, searchNameTerm, sortBy, sortDirection } = query;

  //   const skip = (page - 1) * pageSize;

  //   const [blogs, totalCount] = await this.blogsRepository
  //     .createQueryBuilder('blog')
  //     .where('blog.name ILIKE :search', { search: `%${searchNameTerm || ''}%` })
  //     .orderBy(`blog.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
  //     .skip(skip)
  //     .take(pageSize)
  //     .getManyAndCount();

  //   const pagesCount = Math.ceil(totalCount / pageSize);

  //   return {
  //     pagesCount,
  //     page,
  //     pageSize,
  //     totalCount,
  //     items: blogs.map((b) => new BlogsViewDto(b)),
  //   };
  // }

  async getQuestionById(questionId: number): Promise<QuestionsViewDto | null> {
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    return question ? new QuestionsViewDto(question) : null;
  }
}
