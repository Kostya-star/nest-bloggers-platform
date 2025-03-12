import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.schema';
import { CreateQuestionDto } from '../api/input-dto/create-question.dto';
import { UpdateQuestionInputDto } from '../api/input-dto/update-question-input.dto';
import { PublishQuestionInputDto } from '../api/input-dto/publish-question-input.dto';

@Injectable()
export class QuestionsCommandsRepository {
  constructor(@InjectRepository(Question) private questionsRepository: Repository<Question>) {}

  async getQuestionById(questionId: number): Promise<Question | null> {
    return await this.questionsRepository.findOne({ where: { id: questionId } })
  }

  async createQuestion(newQuestion: CreateQuestionDto): Promise<number> {
    const createdQuestion = this.questionsRepository.create(newQuestion);
    const savedQuestion = await this.questionsRepository.save(createdQuestion);
    return savedQuestion.id;
  }

  async updateQuestion(questionId: number, updates: UpdateQuestionInputDto): Promise<void> {
    await this.questionsRepository.update(questionId, updates);
  }

  async publishQuestion(questionId: number, updates: PublishQuestionInputDto): Promise<void> {
    await this.questionsRepository.update(questionId, updates);
  }

  async deleteQuestion(questionId: number): Promise<void> {
    await this.questionsRepository.delete(questionId);
  }
}
