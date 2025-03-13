import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlayerDto } from '../api/input-dto/create-player.dto';
import { PlayerCommandsRepository } from '../infrastructure/player-commands.repository';
import { GameCommandsRepository } from '../infrastructure/game-commands.repository';
import { QuestionsCommandsRepository } from '../../questions/infrastructure/questions-commands.repository';
import { GameQuestionsCommandsRepository } from '../infrastructure/game-questions-commands.repository';
import { SetRandomGameQuestionDto } from '../api/input-dto/set-random-game-question.dto';
import { ForbiddenException } from '@nestjs/common';

export class CreateConnectionCommand {
  constructor(public userId: number) {}
}

@CommandHandler(CreateConnectionCommand)
export class CreateConnectionUseCase implements ICommandHandler<CreateConnectionCommand, number> {
  constructor(
    private playerCommandsRepository: PlayerCommandsRepository,
    private gameCommandsRepository: GameCommandsRepository,
    private questionsCommandsRepository: QuestionsCommandsRepository,
    private gameQuestionsCommandsRepository: GameQuestionsCommandsRepository,
  ) {}

  async execute({ userId }: CreateConnectionCommand): Promise<number> {
    const newPlayer: CreatePlayerDto = {
      userId,
      score: 0,
    };

    const currentUserActiveGames = await this.gameCommandsRepository.findUserGameInProgress(userId);

    if (currentUserActiveGames.length) throw new ForbiddenException('The current user is already in an active game');

    const newPlayerId = await this.playerCommandsRepository.createPlayer(newPlayer);

    const game = await this.gameCommandsRepository.findPendingGame();

    if (game === null) {
      const pendingGameId = await this.gameCommandsRepository.createPendingGame(newPlayerId);
      return pendingGameId;
    }

    await this.gameCommandsRepository.addPlayerToPendingGame(game.id, newPlayerId);

    const randomQuestions = await this.questionsCommandsRepository.getFiveRandomQuestions();

    const gameQuestions: SetRandomGameQuestionDto[] = randomQuestions.map((q) => ({
      gameId: game.id,
      questionId: q.id,
    }));

    await this.gameQuestionsCommandsRepository.setRandomGameQuestions(gameQuestions);

    return game.id;
  }
}
