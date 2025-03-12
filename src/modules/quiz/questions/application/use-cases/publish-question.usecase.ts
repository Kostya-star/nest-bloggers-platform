import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';
import { PublishQuestionInputDto } from '../../api/input-dto/publish-question-input.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class PublishQuestionCommand {
  constructor(
    public questionId: number,
    public updates: PublishQuestionInputDto,
  ) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand, void> {
  constructor(private questionsCommandsRepository: QuestionsCommandsRepository) {}

  async execute({ questionId, updates }: PublishQuestionCommand): Promise<void> {
    const question = await this.questionsCommandsRepository.getQuestionById(+questionId);

    if (!question) {
      throw new NotFoundException('question not found');
    }

    if (!question.correctAnswers.length) {
      throw new BadRequestException([{ field: 'correctAnswers', message: 'question doesnt have correct answers' }]);
    }

    await this.questionsCommandsRepository.publishQuestion(questionId, updates);
  }
}
