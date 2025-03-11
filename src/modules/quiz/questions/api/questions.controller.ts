import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CreateQuestionInputDto } from './input-dto/create-question-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../application/use-cases/create-question.usecase';
import { QuestionsViewDto } from './view-dto/questions-view.dto';
import { QuestionsQueryRepository } from '../infrastructure/questions-query.repository';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question.usecase';
import { UpdateQuestionInputDto } from './input-dto/update-question-input.dto';
import { UpdateQuestionCommand } from '../application/use-cases/update-question.usecase';

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

  @Put(':questionId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updates: UpdateQuestionInputDto,
  ): Promise<void> {
    const question = await this.questionsQueryRepository.getQuestionById(+questionId);

    if (!question) {
      throw new NotFoundException('question not found');
    }

    await this.commandBus.execute<UpdateQuestionCommand, void>(new UpdateQuestionCommand(+questionId, updates));
  }

  @Delete(':questionId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('questionId') questionId: string): Promise<void> {
    const question = await this.questionsQueryRepository.getQuestionById(+questionId);

    if (!question) {
      throw new NotFoundException('question not found');
    }

    await this.commandBus.execute<DeleteQuestionCommand, void>(new DeleteQuestionCommand(+questionId));
  }
}
