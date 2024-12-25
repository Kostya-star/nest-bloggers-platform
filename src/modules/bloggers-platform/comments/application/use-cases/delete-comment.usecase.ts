import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsCommandsRepository } from '../../infrastructure/comments-commands.repository';

export class DeleteCommentCommand {
  constructor(public readonly commentId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand, void> {
  constructor(private readonly commentsCommandsRepository: CommentsCommandsRepository) {}

  async execute({ commentId }: DeleteCommentCommand): Promise<void> {
    await this.commentsCommandsRepository.deleteComment(commentId);
  }
}
