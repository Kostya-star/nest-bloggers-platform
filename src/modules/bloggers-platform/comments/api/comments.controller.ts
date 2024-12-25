import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsViewDto } from './view-dto/comments-view.dto';
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';
import { ObjectIdValidationPipe } from 'src/core/pipes/object-id-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { LikeCommentStatusInputDto } from './input-dto/like-comment-status-input.dto';
import { ExtractUserFromRequest } from 'src/core/decorators/extract-user-from-req.decorator';
import { UserContext } from 'src/core/dto/user-context';
import { UsersQueryRepository } from 'src/modules/user-accounts/users/infrastructure/users-query.repository';
import { CommandBus } from '@nestjs/cqrs';
import { HandleLikeCommand } from '../../likes/application/use-cases/handle-like.usecase';

@Controller('comments')
export class CommnetsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Put(':commentId/like-status')
  @UseGuards(AuthGuard('jwt-auth-guard'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeComment(
    @Param('commentId', ObjectIdValidationPipe) commentId: string,
    @Body() body: LikeCommentStatusInputDto,
    @ExtractUserFromRequest() user: UserContext,
  ): Promise<void> {
    const comment = await this.commentsQueryRepository.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    const userInfo = await this.usersQueryRepository.getUserById(user.userId);

    if (!userInfo) {
      throw new NotFoundException('user not found');
    }

    await this.commandBus.execute<HandleLikeCommand, void>(
      new HandleLikeCommand(commentId, body.likeStatus, user.userId, userInfo.login),
    );
  }

  @Get(':commId')
  async getCommentById(@Param('commId', ObjectIdValidationPipe) commId: string): Promise<CommentsViewDto> {
    // TODO. temporarily while no access token
    const userId = '';

    const comment = await this.commentsQueryRepository.getCommentById(commId, userId);

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return comment;
  }
}
