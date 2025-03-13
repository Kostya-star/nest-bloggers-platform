import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../domain/player.schema';
import { CreatePlayerDto } from '../api/input-dto/create-player.dto';

@Injectable()
export class PlayerCommandsRepository {
  constructor(@InjectRepository(Player) private playerRepository: Repository<Player>) {}

  async getPlayerByUserId(userId: number): Promise<Player | null> {
    return await this.playerRepository.findOne({ where: { userId } });
  }

  async createPlayer(player: CreatePlayerDto): Promise<number> {
    const createdPlayer = this.playerRepository.create(player);
    const savedPlayer = await this.playerRepository.save(createdPlayer);
    return savedPlayer.id;
  }

  // async updateQuestion(questionId: number, updates: UpdateQuestionInputDto): Promise<void> {
  //   await this.questionsRepository.update(questionId, updates);
  // }

  // async deleteQuestion(questionId: number): Promise<void> {
  //   await this.questionsRepository.delete(questionId);
  // }
}
