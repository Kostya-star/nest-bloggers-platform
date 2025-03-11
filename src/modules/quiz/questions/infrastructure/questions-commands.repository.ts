import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.schema';
import { CreateQuestionDto } from '../api/input-dto/create-question.dto';

@Injectable()
export class QuestionsCommandsRepository {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) {}

  async createQuestion(newQuestion: CreateQuestionDto): Promise<number> {
    const createdQuestion = this.questionsRepository.create(newQuestion);
    const savedQuestion = await this.questionsRepository.save(createdQuestion);
    return savedQuestion.id;
  }
}
