import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { CreateConnectionCommand } from '../application/create-connection.usecase';

@Controller('pair-game-quiz/pairs')
export class GameController {
  constructor(private commandBus: CommandBus) {}

  @Post('connection')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  @HttpCode(HttpStatus.OK)
  async createConnection(@ExtractUserFromRequest() user: UserContext): Promise<any> {
    const gameId = await this.commandBus.execute<CreateConnectionCommand, void>(
      new CreateConnectionCommand(+user.userId),
    );

    // fetch for current game by gameId and return response...
  }
}
