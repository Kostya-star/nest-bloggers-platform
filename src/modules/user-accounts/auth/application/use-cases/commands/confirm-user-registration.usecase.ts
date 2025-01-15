import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isAfter } from 'date-fns';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';

export class ConfirmUserRegistrationCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmUserRegistrationCommand)
export class ConfirmUserRegistrationUseCase implements ICommandHandler<ConfirmUserRegistrationCommand, void> {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}

  async execute({ code }: ConfirmUserRegistrationCommand): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByEmailConfirmationCode(code);

    if (!user) {
      throw new BadRequestException([{ field: 'code', message: 'Code is incorrect' }]);
    }

    if (user.emailConfirmationIsConfirmed) {
      throw new BadRequestException([{ field: 'code', message: 'Code has been applied' }]);
    }

    const isExpired = isAfter(new Date(), user.emailConfirmationExpDate!);

    if (isExpired) {
      throw new BadRequestException([{ field: 'code', message: 'Code expired' }]);
    }

    await this.usersCommandsRepository.updateUser(user.id, { emailConfirmationIsConfirmed: true });
  }
}
