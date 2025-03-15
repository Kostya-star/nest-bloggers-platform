import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../domain/answer.schema';
import { Game } from '../domain/game.schema';

@Injectable()
export class AnswersCommandsRepository {
  constructor(
    @InjectRepository(Answer) private answersRepository: Repository<Answer>,
    // @InjectRepository(Answer) private answersRepository: Repository<Answer>,
  ) {}

  async getPlayerAnswers(userId: number, activeUserGameId: number): Promise<Answer[]> {
    const playerAnswers = await this.answersRepository
      .createQueryBuilder('answers')
      .leftJoin('answers.player', 'player')
      // ASK is this ok or its best to inject game repo here and use tis instead?
      .leftJoin(Game, 'game', 'game."firstPlayerId" = player.id OR game."secondPlayerId" = player.id')
      .where('player."userId" = :userId', { userId })
      .andWhere('game.id = :activeUserGameId', { activeUserGameId })
      .getMany();

    // console.log(JSON.stringify(playerAnswers, null, 3));

    return playerAnswers;
  }

  // async createPlayer(player: CreatePlayerDto): Promise<number> {
  //   const createdPlayer = this.playerRepository.create(player);
  //   const savedPlayer = await this.playerRepository.save(createdPlayer);
  //   return savedPlayer.id;
  // }

  // async updateQuestion(questionId: number, updates: UpdateQuestionInputDto): Promise<void> {
  //   await this.questionsRepository.update(questionId, updates);
  // }

  // async deleteQuestion(questionId: number): Promise<void> {
  //   await this.questionsRepository.delete(questionId);
  // }
}
