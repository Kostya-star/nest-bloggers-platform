import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';
import { UpdateQuestionInputDto } from '../../api/input-dto/update-question-input.dto';

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
    await this.questionsCommandsRepository.updateQuestion(questionId, updates);
  }
}
