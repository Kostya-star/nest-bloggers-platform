import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';
import { UpdateQuestionInputDto } from '../../api/input-dto/update-question-input.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UpdateQuestionCommand {
  constructor(
    public questionId: number,
    public updates: UpdateQuestionInputDto,
  ) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand, void> {
  constructor(private questionsCommandsRepository: QuestionsCommandsRepository) {}

  async execute({ questionId, updates }: UpdateQuestionCommand): Promise<void> {
    const question = await this.questionsCommandsRepository.getQuestionById(+questionId);

    if (!question) {
      throw new NotFoundException('question not found');
    }

    if (question.published) {
      throw new BadRequestException([{ field: 'published', message: 'question is published already' }]);
    }

    await this.questionsCommandsRepository.updateQuestion(questionId, updates);
  }
}
