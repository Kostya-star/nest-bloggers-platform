import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameQuestions } from '../domain/game-questions.schema';
import { SetRandomGameQuestionDto } from '../api/input-dto/set-random-game-question.dto';

@Injectable()
export class GameQuestionsCommandsRepository {
  constructor(@InjectRepository(GameQuestions) private gameQuestionsRepository: Repository<GameQuestions>) {}

  // async findPendingGame(): Promise<Game | null> {
  //   return await this.gameRepository.findOne({ where: { secondPlayerId: IsNull() } });
  // }

  async setRandomGameQuestions(gameQuestions: SetRandomGameQuestionDto[]): Promise<GameQuestions[]> {
    const created = this.gameQuestionsRepository.create(gameQuestions);
    const saved = await this.gameQuestionsRepository.save(created);
    return saved;
  }

  // async addPlayerToPendingGame(gameId: number, secondPlayerId: number): Promise<void> {
  //   await this.gameRepository.update(gameId, { secondPlayerId });
  // }

  // async updateQuestion(questionId: number, updates: UpdateQuestionInputDto): Promise<void> {
  //   await this.questionsRepository.update(questionId, updates);
  // }

  // async deleteQuestion(questionId: number): Promise<void> {
  //   await this.questionsRepository.delete(questionId);
  // }
}
