import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateQuestionCommand {
  constructor(
    public readonly body: string,
    public readonly correctAnswers: string[],
  ) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand, number> {
  constructor() {} // private readonly commentsCommandRepository: CommentsCommandsRepository

  async execute(questionBody: CreateQuestionCommand): Promise<number> {
    return await this.commentsCommandRepository.createComment(questionBody);
  }
}
