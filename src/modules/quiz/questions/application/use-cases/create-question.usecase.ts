import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';
import { CreateQuestionInputDto } from '../../api/input-dto/create-question-input.dto';
import { CreateQuestionDto } from '../../api/input-dto/create-question.dto';

export class CreateQuestionCommand {
  constructor(public question: CreateQuestionInputDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand, number> {
  constructor(private questionsCommandsRepository: QuestionsCommandsRepository) {}

  async execute({ question }: CreateQuestionCommand): Promise<number> {
    const questionBody: CreateQuestionDto = {
      ...question,
      published: false,
    };

    return await this.questionsCommandsRepository.createQuestion(questionBody);
  }
}
