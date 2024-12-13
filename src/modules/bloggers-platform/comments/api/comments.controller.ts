import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommentsViewDto } from './view.dto/comments-view.dto';
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';

@Controller('comments')
export class CommnetsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':commId')
  async getCommentById(
    @Param('commId') commId: string,
  ): Promise<CommentsViewDto> {
    // TODO. temporarily while no access token
    const userId = '';

    const comment = await this.commentsQueryRepository.getCommentById(
      commId,
      userId,
    );

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return comment;
  }
}
