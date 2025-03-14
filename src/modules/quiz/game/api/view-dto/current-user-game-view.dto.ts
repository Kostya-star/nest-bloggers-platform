import { AnswerStatus } from '../../dto/answer-status';
import {
  ActiveGameStatuses,
  PlayerJoined,
  UserCurrentGameQueryUnmappedResult,
} from '../../dto/UserCurrentGameQueryUnmappedResult';

interface PlayerEntity {
  answers: {
    questionId: string;
    answerStatus: AnswerStatus;
    addedAt: string;
  }[];
  player: {
    id: string;
    login: string;
  };
  score: number;
}

export class CurrentUserGameViewDto {
  id: string;
  firstPlayerProgress: PlayerEntity;
  secondPlayerProgress: PlayerEntity | null;
  questions:
    | {
        id: string;
        body: string;
      }[]
    | null;
  status: ActiveGameStatuses;
  pairCreatedDate: string;
  startGameDate: string | null;
  finishGameDate: string | null;

  constructor({
    id,
    firstPlayer,
    secondPlayer,
    questions,
    status,
    createdAt,
    startDate,
    finishDate,
  }: UserCurrentGameQueryUnmappedResult) {
    this.id = id.toString();
    this.firstPlayerProgress = this.setPlayer(firstPlayer);
    this.secondPlayerProgress = secondPlayer === null ? null : this.setPlayer(secondPlayer);
    this.questions =
      // questions === null ASK - how to make postgress return questions as null instead of '[]'
      !questions?.length
        ? null
        : questions.map(({ questionId, question }) => ({ id: questionId.toString(), body: question.body }));
    this.status = status;
    this.pairCreatedDate = createdAt;
    this.startGameDate = startDate;
    this.finishGameDate = finishDate;
  }

  private setPlayer(player: PlayerJoined) {
    return {
      answers: player.answers.map(({ questionId, status, createdAt }) => ({
        questionId: questionId.toString(),
        answerStatus: status,
        addedAt: createdAt,
      })),
      player: { id: player.user.id.toString(), login: player.user.login },
      score: player.score,
    };
  }
}
