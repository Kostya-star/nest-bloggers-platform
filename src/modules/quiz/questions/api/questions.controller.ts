import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CreateQuestionInputDto } from './input-dto/create-question-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/use-cases/create-question.usecase';
import { QuestionsViewDto } from './view-dto/questions-view.dto';
import { QuestionsQueryRepository } from '../infrastructure/questions-query.repository';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  constructor(
    private commandBus: CommandBus,
    private questionsQueryRepository: QuestionsQueryRepository,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() question: CreateQuestionInputDto): Promise<QuestionsViewDto> {
    const questionId = await this.commandBus.execute<CreateQuestionCommand, number>(
      new CreateQuestionCommand(question),
    );

    const newQuestion = await this.questionsQueryRepository.getQuestionById(questionId);

    if (!newQuestion) {
      throw new NotFoundException('question not found');
    }

    return newQuestion;
  }
}
