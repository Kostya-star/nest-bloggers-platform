import { Question } from '../../domain/question.schema';

export class QuestionsViewDto {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(question: Question) {
    this.id = question.id.toString();
    this.body = question.body;
    this.correctAnswers = question.correctAnswers;
    this.published = question.published;
    this.createdAt = question.createdAt;
    this.updatedAt = question.updatedAt;
  }
}
