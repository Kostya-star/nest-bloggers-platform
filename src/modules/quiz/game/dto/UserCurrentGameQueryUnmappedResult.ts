import { AnswerStatus } from './answer-status';
import { GameStatuses } from './game-statuses';

export type ActiveGameStatuses = Exclude<GameStatuses, GameStatuses.Finished>;

export interface PlayerJoined {
  score: number;
  user: { id: number; login: string };
  answers: {
    questionId: number;
    status: AnswerStatus;
    createdAt: string;
  }[];
}

interface GameQuestionsJoined {
  questionId: number;
  question: {
    body: string;
  };
}

export interface UserCurrentGameQueryUnmappedResult {
  id: number;
  status: ActiveGameStatuses;
  startDate: string | null;
  finishDate: string | null;
  createdAt: string;
  firstPlayer: PlayerJoined;
  secondPlayer: PlayerJoined | null;
  questions: GameQuestionsJoined[] | null;
}
