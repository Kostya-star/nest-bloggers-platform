import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePlayerDto } from '../api/input-dto/create-player.dto';
import { PlayerCommandsRepository } from '../infrastructure/player-commands.repository';

export class CreateConnectionCommand {
  constructor(public userId: number) {}
}

@CommandHandler(CreateConnectionCommand)
export class CreateConnectionUseCase implements ICommandHandler<CreateConnectionCommand, any> {
  constructor(private playerCommandsRepository: PlayerCommandsRepository) {}

  async execute({ userId }: CreateConnectionCommand): Promise<any> {
    const newPlayer: CreatePlayerDto = {
      userId,
      score: 0,
    };

    const newPlayerId = await this.playerCommandsRepository.createPlayer(newPlayer);

    console.log('NEW PLAYER ID', newPlayerId);

    // return await this.questionsCommandsRepository.createQuestion(questionBody);
  }
}
