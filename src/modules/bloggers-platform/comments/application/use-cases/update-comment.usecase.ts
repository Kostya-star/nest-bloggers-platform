import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsCommandsRepository } from '../../infrastructure/comments-commands.repository';
import { UpdateCommentInputDto } from '../../api/input-dto/update-comment-input.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: number,
    public readonly updates: UpdateCommentInputDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand, void> {
  constructor(private readonly commentsComandsRepository: CommentsCommandsRepository) {}

  async execute({ commentId, updates }: UpdateCommentCommand): Promise<void> {
    await this.commentsComandsRepository.updateComment(commentId, updates);
  }
}
