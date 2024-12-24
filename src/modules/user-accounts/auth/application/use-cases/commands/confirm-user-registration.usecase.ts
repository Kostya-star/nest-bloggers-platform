import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { isAfter } from 'date-fns';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { EmailConfirmationDto } from '../../../dto/email-confirmation.dto';

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

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([{ field: 'code', message: 'Code has been applied' }]);
    }

    const isExpired = isAfter(new Date(), user.emailConfirmation.expDate as Date);

    if (isExpired) {
      throw new BadRequestException([{ field: 'code', message: 'Code expired' }]);
    }

    await this.usersCommandsRepository.updateUserEmailConfirmation(user._id.toString(), {
      ...user.emailConfirmation,
      isConfirmed: true,
    });
  }
}
