import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsCommandsRepository } from '../../infrastructure/questions-commands.repository';
import { PublishQuestionInputDto } from '../../api/input-dto/publish-question-input.dto';

export class PublishQuestionCommand {
  constructor(
    public questionId: number,
    public updates: PublishQuestionInputDto,
  ) {}
}
// ASK
// есть 2 одинаковых +- ендпоинта на обновление вопроса которые обновляют вопрос а также публткуют.
// эта логика должна быть разделена или вместе быть?
// просто там еще есть нюансы в этих запросах(бизнесс логика которая может выкидывать 400 ошибку)
// и если эти нюансы (бизнесс лоргика) будет описана еще до запросов(в дто валидаторах) то как понимаю
// можно совместить остальную логику(юз кейсы+команды + хэндлеры репозитория) обычного редактирования и публикования
@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase implements ICommandHandler<PublishQuestionCommand, void> {
  constructor(private questionsCommandsRepository: QuestionsCommandsRepository) {}

  async execute({ questionId, updates }: PublishQuestionCommand): Promise<void> {
    await this.questionsCommandsRepository.publishQuestion(questionId, updates);
  }
}
