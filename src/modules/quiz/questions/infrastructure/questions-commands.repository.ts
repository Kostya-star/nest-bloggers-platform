import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInputDto } from '../api/input-dto/create-question-input.dto';

@Injectable()
export class QuestionsCommandsRepository {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) {}

  async createComment(newQuestion: CreateQuestionInputDto): Promise<number> {
    const savedQuestion = await this.questionsRepository.save(newQuestion);
    return savedQuestion.id;
  }
}
