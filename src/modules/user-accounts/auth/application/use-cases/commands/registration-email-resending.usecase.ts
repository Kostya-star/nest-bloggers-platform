import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/modules/notifications/email.service';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { EmailConfirmationDto } from '../../../dto/email-confirmation.dto';
import { EmailMessageDto } from '../../../dto/email-message.dto';
import { UserConfirmationEmailResendEvent } from 'src/modules/notifications/events/user-confirmation-email-resend.event';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand, void> {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private emailService: EmailService,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: RegistrationEmailResendingCommand): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException([{ field: 'email', message: 'Email is incorrect' }]);
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([{ field: 'email', message: 'Code has been applied' }]);
    }

    const emailConfirmation = new EmailConfirmationDto();

    await this.usersCommandsRepository.updateUserEmailConfirmation(user._id.toString(), emailConfirmation);

    const message = EmailMessageDto.create(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    this.eventBus.publish(
      new UserConfirmationEmailResendEvent(
        "'Petr' kostya.danilov.99@mail.ru",
        user.email,
        'Registration Confirmation',
        message,
      ),
    );
  }
}
