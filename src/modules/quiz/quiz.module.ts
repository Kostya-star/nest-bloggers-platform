import { Module } from '@nestjs/common';
import { QuizQuestionsController } from './questions/api/questions.controller';
import { Question } from './questions/domain/question.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateQuestionUseCase } from './questions/application/use-cases/create-question.usecase';
import { QuestionsCommandsRepository } from './questions/infrastructure/questions-commands.repository';
import { QuestionsQueryRepository } from './questions/infrastructure/questions-query.repository';
import { DeleteQuestionUseCase } from './questions/application/use-cases/delete-question.usecase';

const commands = [CreateQuestionUseCase, DeleteQuestionUseCase];
const repos = [QuestionsCommandsRepository, QuestionsQueryRepository];
const services = [];

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuizQuestionsController],
  providers: [...services, ...repos, ...commands],
  exports: [],
})
export class QuizModule {}
