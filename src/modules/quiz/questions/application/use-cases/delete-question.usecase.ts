import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';

export class DeleteQuestionCommand {
  constructor(public questionId: number) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand, void> {
  constructor(private questionsCommandsRepository: QuestionsCommandsRepository) {}

  async execute({ questionId }: DeleteQuestionCommand): Promise<void> {
    await this.questionsCommandsRepository.deleteQuestion(questionId);
  }
}
