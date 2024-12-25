import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { CreatePostCommentDto } from '../../dto/create-post-comment.dto';
import { CommentsCommandsRepository } from '../../infrastructure/comments-commands.repository';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';

export class CreatePostCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly content: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentUseCase implements ICommandHandler<CreatePostCommentCommand, MongooseObjtId> {
  constructor(
    private readonly usersCommandsRepository: UsersCommandsRepository,
    private readonly commentsCommandRepository: CommentsCommandsRepository,
  ) {}

  async execute({ userId, postId, content }: CreatePostCommentCommand): Promise<MongooseObjtId> {
    const userInfo = await this.usersCommandsRepository.findUserById(userId);

    const postComment: CreatePostCommentDto = {
      content,
      postId,
      commentatorInfo: {
        userId,
        userLogin: userInfo!.login,
      },
    };

    return await this.commentsCommandRepository.createComment(postComment);
  }
}
