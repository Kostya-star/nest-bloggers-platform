import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CreateQuestionInputDto } from './input-dto/create-question-input.dto';

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() question: CreateQuestionInputDto): Promise<any> {
    const newQuestion = await await this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(+commentId, updates),
    );
  }
}
