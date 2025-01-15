import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { EmailService } from 'src/modules/notifications/email.service';
import { User } from 'src/modules/user-accounts/users/domain/user.schema';
import { UserEmailConfirmationDto } from 'src/modules/user-accounts/users/dto/user-email-confirmation.dto';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand, void> {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private emailService: EmailService,
  ) {}

  async execute({ email }: RegistrationEmailResendingCommand): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException([{ field: 'email', message: 'Email is incorrect' }]);
    }

    if (user.emailConfirmationIsConfirmed) {
      throw new BadRequestException([{ field: 'email', message: 'Code has been applied' }]);
    }

    const { code, expDate, isConfirmed }: UserEmailConfirmationDto = User.generateEmailConfirmationDetails();

    await this.usersCommandsRepository.updateUser(user.id, {
      emailConfirmationCode: code,
      emailConfirmationExpDate: expDate,
      emailConfirmationIsConfirmed: isConfirmed,
    });

    const message = EmailService.getEmailMessageTemplate(
      'registration-confirmation',
      'Confirm registration',
      'code',
      code,
    );

    this.emailService.sendMail("'Petr' kostya.danilov.99@mail.ru", user.email, 'Registration Confirmation', message);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
