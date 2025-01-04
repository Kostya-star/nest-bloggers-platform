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

    if (user.email_confirmation_is_confirmed) {
      throw new BadRequestException([{ field: 'code', message: 'Code has been applied' }]);
    }

    const isExpired = isAfter(new Date(), user.email_confirmation_exp_date);

    if (isExpired) {
      throw new BadRequestException([{ field: 'code', message: 'Code expired' }]);
    }

    await this.usersCommandsRepository.updateUser(user.id.toString(), { email_confirmation_is_confirmed: true });
  }
}
