import { Module } from '@nestjs/common';
import { QuizQuestionsController } from './questions/api/questions.controller';
import { Question } from './questions/domain/question.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateQuestionUseCase } from './questions/application/use-cases/create-question.usecase';
import { QuestionsCommandsRepository } from './questions/infrastructure/questions-commands.repository';
import { QuestionsQueryRepository } from './questions/infrastructure/questions-query.repository';
import { DeleteQuestionUseCase } from './questions/application/use-cases/delete-question.usecase';
import { UpdateQuestionUseCase } from './questions/application/use-cases/update-question.usecase';
import { PublishQuestionUseCase } from './questions/application/use-cases/publish-question.usecase';
import { CreateConnectionUseCase } from './game/application/create-connection.usecase';
import { PlayerCommandsRepository } from './game/infrastructure/player-commands.repository';
import { Player } from './game/domain/player.schema';
import { GameController } from './game/api/game.controller';

const questionCommands = [CreateQuestionUseCase, DeleteQuestionUseCase, UpdateQuestionUseCase, PublishQuestionUseCase];
const gameCommands = [CreateConnectionUseCase];
const commands = [...questionCommands, ...gameCommands];

const repos = [QuestionsCommandsRepository, QuestionsQueryRepository, PlayerCommandsRepository];
const services = [];

@Module({
  imports: [TypeOrmModule.forFeature([Question, Player])],
  controllers: [QuizQuestionsController, GameController],
  providers: [...services, ...repos, ...commands],
  exports: [],
})
export class QuizModule {}
