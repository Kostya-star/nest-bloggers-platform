import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesCommandRepository } from '../../infrastructure/likes-command.repository';
import { LikeStatus } from '../../domain/likes-status';

export class HandleLikeCommand {
  constructor(
    public readonly likedEntityId: string,
    public readonly likeStatus: LikeStatus,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(HandleLikeCommand)
export class HandleLikeUseCase implements ICommandHandler<HandleLikeCommand, void> {
  constructor(private readonly likesCommandRepository: LikesCommandRepository) {}

  async execute({ userId, likedEntityId, likeStatus, userLogin }: HandleLikeCommand): Promise<void> {
    await this.likesCommandRepository.updateLike(likedEntityId, likeStatus, userId, userLogin);
  }
}
