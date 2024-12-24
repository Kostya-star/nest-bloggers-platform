import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersCommandsRepository } from '../../../infrastructure/users-commands-repository';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand, void> {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    await this.usersCommandsRepository.deleteUser(command.userId);
  }
}
