import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommentDto } from '../../dto/create-post-comment.dto';
import { CommentsCommandsRepository } from '../../infrastructure/comments-commands.repository';

export class CreatePostCommentCommand {
  constructor(
    public readonly postId: number,
    public readonly content: string,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentUseCase implements ICommandHandler<CreatePostCommentCommand, number> {
  constructor(private readonly commentsCommandRepository: CommentsCommandsRepository) {}

  async execute({ userId, postId, content }: CreatePostCommentCommand): Promise<number> {
    const postComment: CreatePostCommentDto = {
      content,
      postId,
      userId,
    };

    return await this.commentsCommandRepository.createComment(postComment);
  }
}
