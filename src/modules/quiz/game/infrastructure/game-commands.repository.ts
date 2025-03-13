import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Game } from '../domain/game.schema';
import { GameStatuses } from '../api/input-dto/game-statuses';

@Injectable()
export class GameCommandsRepository {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async findPendingGame(): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { secondPlayerId: IsNull(), status: GameStatuses.PendingSecondPlayer },
    });
  }

  // finds out if the current user is already participating in any game of status Active or PendingSecondPlayer
  async findUserGameInProgress(userId: number): Promise<Game[]> {
    return await this.gameRepository
      .createQueryBuilder('g')
      .leftJoin('g.firstPlayer', 'p1')
      .leftJoin('g.secondPlayer', 'p2')
      .where('(p1."userId" = :userId OR p2."userId" = :userId)', { userId })
      .andWhere(`(g.status = :pending OR g.status = :active)`, {
        pending: GameStatuses.PendingSecondPlayer,
        active: GameStatuses.Active,
      })
      .getMany();
  }

  async createPendingGame(firstPlayerId: number): Promise<number> {
    const createdGame = this.gameRepository.create({
      firstPlayerId,
      secondPlayerId: null,
      status: GameStatuses.PendingSecondPlayer,
    });
    const savedGame = await this.gameRepository.save(createdGame);
    return savedGame.id;
  }

  async addPlayerToPendingGame(gameId: number, secondPlayerId: number): Promise<void> {
    await this.gameRepository.update(gameId, { secondPlayerId, status: GameStatuses.Active });
  }

  // async updateQuestion(questionId: number, updates: UpdateQuestionInputDto): Promise<void> {
  //   await this.questionsRepository.update(questionId, updates);
  // }

  // async deleteQuestion(questionId: number): Promise<void> {
  //   await this.questionsRepository.delete(questionId);
  // }
}
