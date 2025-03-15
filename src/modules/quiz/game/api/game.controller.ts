import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
  InternalServerErrorException,
  Body,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { CreateConnectionCommand } from '../application/create-connection.usecase';
import { GameQueryRepository } from '../infrastructure/game-query.repository';
import { CurrentUserGameViewDto } from './view-dto/current-user-game-view.dto';
import { ProcessAnswerCommand } from '../application/process-answer.usecase';
import { AnswerBodyInputDto } from './input-dto/answer-body-input.dto';

@Controller('pair-game-quiz/pairs')
export class GameController {
  constructor(
    private commandBus: CommandBus,
    private gameQueryRepository: GameQueryRepository,
  ) {}

  @Get('my-current')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  async getCurrentUserGameInProcess(@ExtractUserFromRequest() user: UserContext): Promise<CurrentUserGameViewDto> {
    const currentUserGame = await this.gameQueryRepository.getCurrentUserGameInProcess(+user.userId);

    if (!currentUserGame) throw new NotFoundException('game not found');

    return currentUserGame;
  }

  @Post('connection')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  @HttpCode(HttpStatus.OK)
  async createConnection(@ExtractUserFromRequest() user: UserContext): Promise<CurrentUserGameViewDto> {
    await this.commandBus.execute<CreateConnectionCommand, number>(new CreateConnectionCommand(+user.userId));

    const currentUserGame = await this.gameQueryRepository.getCurrentUserGameInProcess(+user.userId);

    if (!currentUserGame) throw new InternalServerErrorException();

    return currentUserGame;
  }

  @Post('my-current/answers')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  @HttpCode(HttpStatus.OK)
  async processAnswer(
    @ExtractUserFromRequest() user: UserContext,
    @Body() answerBody: AnswerBodyInputDto,
  ): Promise<any> {
    await this.commandBus.execute<ProcessAnswerCommand, void>(new ProcessAnswerCommand(+user.userId, answerBody));
  }
}
