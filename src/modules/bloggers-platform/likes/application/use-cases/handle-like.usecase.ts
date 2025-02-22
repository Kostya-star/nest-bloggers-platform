import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesCommandRepository } from '../../infrastructure/likes-command.repository';
import { LikeStatus } from '../../const/like-status';

export class HandleLikeCommand {
  constructor(
    public readonly likedEntityId: number,
    public readonly likeStatus: LikeStatus,
    public readonly userId: number,
  ) {}
}

@CommandHandler(HandleLikeCommand)
export class HandleLikeUseCase implements ICommandHandler<HandleLikeCommand, void> {
  constructor(private readonly likesCommandRepository: LikesCommandRepository) {}

  async execute({ userId, likedEntityId, likeStatus }: HandleLikeCommand): Promise<void> {
    await this.likesCommandRepository.updateLike(likedEntityId, likeStatus, userId);
  }
}
