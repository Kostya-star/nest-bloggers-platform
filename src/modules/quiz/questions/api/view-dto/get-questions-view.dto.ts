import { Question } from '../../domain/question.schema';
import { QuestionsViewDto } from './questions-view.dto';

// ASK
// Правильно ли я сделал что заэкстендил этот класс и заюзал супер??
export class GetQuestionsViewDto extends QuestionsViewDto {
  published: boolean;

  constructor(question: Question) {
    super(question);
    this.published = question.published;
  }
}
