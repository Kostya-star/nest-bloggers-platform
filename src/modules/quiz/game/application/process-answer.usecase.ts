import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { PlayerCommandsRepository } from '../infrastructure/player-commands.repository';
import { GameCommandsRepository } from '../infrastructure/game-commands.repository';
import { QuestionsCommandsRepository } from '../../questions/infrastructure/questions-commands.repository';
import { GameQuestionsCommandsRepository } from '../infrastructure/game-questions-commands.repository';
import { SetRandomGameQuestionDto } from '../dto/set-random-game-question.dto';
import { ForbiddenException } from '@nestjs/common';
import { AnswerBodyInputDto } from '../api/input-dto/answer-body-input.dto';
import { AnswersCommandsRepository } from '../infrastructure/answers-commands.repository';

export class ProcessAnswerCommand {
  constructor(
    public userId: number,
    public answerBody: AnswerBodyInputDto,
  ) {}
}

@CommandHandler(ProcessAnswerCommand)
export class ProcessAnswerUseCase implements ICommandHandler<ProcessAnswerCommand, any> {
  constructor(
    // private playerCommandsRepository: PlayerCommandsRepository,
    private gameCommandsRepository: GameCommandsRepository,
    private answersCommandsRepository: AnswersCommandsRepository,
    // private questionsCommandsRepository: QuestionsCommandsRepository,
    // private gameQuestionsCommandsRepository: GameQuestionsCommandsRepository,
  ) {}

  async execute({ userId, answerBody }: ProcessAnswerCommand): Promise<any> {
    const activeUserGame = await this.gameCommandsRepository.findActiveUserGame(userId);

    if (!activeUserGame) {
      throw new ForbiddenException("The user isn't in an active game or has answered all questions");
    }

    // now we are sure the user is in active game and hasn't answered all of the questions
    const usersAnswers = await this.answersCommandsRepository.getPlayerAnswers(userId, activeUserGame.id);
  }
}
