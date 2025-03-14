import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../domain/game.schema';
import { Repository } from 'typeorm';
import { GameStatuses } from '../dto/game-statuses';
import { UserCurrentGameQueryUnmappedResult } from '../dto/UserCurrentGameQueryUnmappedResult';
import { CurrentUserGameViewDto } from '../api/view-dto/current-user-game-view.dto';

@Injectable()
export class GameQueryRepository {
  constructor(@InjectRepository(Game) private gameRepository: Repository<Game>) {}

  async getCurrentUserGameInProcess(userId: number): Promise<CurrentUserGameViewDto | null> {
    // ASK good? is this how its always done in the projects?
    const extendedGameRes = (await this.gameRepository
      .createQueryBuilder('game')

      .leftJoinAndSelect('game.firstPlayer', 'player1')
      .leftJoinAndSelect('game.secondPlayer', 'player2')

      .leftJoinAndSelect('player1.user', 'player1Details')
      .leftJoinAndSelect('player2.user', 'player2Details')

      .leftJoinAndSelect('player1.answers', 'answersPl1')
      .leftJoinAndSelect('player2.answers', 'answersPl2')

      .leftJoinAndSelect('game.questions', 'setGameQuestions')
      .leftJoinAndSelect('setGameQuestions.question', 'saGameQuestions')

      .where('(player1."userId" = :userId OR player2."userId" = :userId)', { userId })
      .andWhere(`(game.status = :pending OR game.status = :active)`, {
        pending: GameStatuses.PendingSecondPlayer,
        active: GameStatuses.Active,
      })
      .select([
        'game.id',
        'game.status',
        'game.createdAt',
        'game.startDate',
        'game.finishDate',

        'player1Details.id',
        'player1.score',
        'player1Details.login',

        'player2Details.id',
        'player2.score',
        'player2Details.login',

        'answersPl1.questionId',
        'answersPl1.status',
        'answersPl1.createdAt',

        'answersPl2.questionId',
        'answersPl2.status',
        'answersPl2.createdAt',

        'setGameQuestions.questionId',
        'saGameQuestions.body',
      ])
      // ASK what about typing?
      .getOne()) as UserCurrentGameQueryUnmappedResult | null;

    // console.log(JSON.stringify(extendedGameRes, null, 3));

    if (extendedGameRes === null) return null;

    return new CurrentUserGameViewDto(extendedGameRes);
  }

  // async getCommentById(commentId: number, currentUserId: string | undefined = ''): Promise<CommentsViewDto | null> {
  //   const rawComment = await this.commentsRepository
  //     .createQueryBuilder('comm')
  //     .leftJoinAndSelect('comm.user', 'u')
  //     .select('comm')
  //     .addSelect('u.login', 'userLogin')
  //     .where('comm.id = :commentId', { commentId })
  //     .getRawOne();

  //   if (!rawComment) return null;

  //   const comment = {
  //     id: rawComment.comm_id,
  //     content: rawComment.comm_content,
  //     postId: rawComment.comm_postId,
  //     userId: rawComment.comm_userId,
  //     userLogin: rawComment.userLogin,
  //     createdAt: rawComment.comm_createdAt,
  //     updatedAt: rawComment.comm_updatedAt,
  //   } as JoinedComment;

  //   const rawCommentLikes = await this.likesRepository
  //     .createQueryBuilder('like')
  //     .leftJoinAndSelect('like.user', 'u')
  //     .select('like')
  //     .addSelect('u.login', 'userLogin')
  //     .where('like.likedEntityId = :commentId', { commentId })
  //     .getRawMany();

  //   const commentLikes = rawCommentLikes.map(
  //     (like) =>
  //       ({
  //         id: like.like_id,
  //         status: like.like_status,
  //         userId: like.like_userId,
  //         likedEntityId: like.like_likedEntityId,
  //         createdAt: like.like_createdAt,
  //         updatedAt: like.like_updatedAt,
  //         userLogin: like.userLogin,
  //       }) as JoinedLike,
  //   );

  //   const { newestLikes, ...likesInfo } = getLikesInfo(commentLikes, currentUserId);

  //   return new CommentsViewDto({ ...comment, likesInfo });
  // }
}
