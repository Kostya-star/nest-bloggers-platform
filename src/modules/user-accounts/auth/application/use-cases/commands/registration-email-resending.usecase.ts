import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { UserConfirmationEmailResendEvent } from 'src/modules/notifications/events/user-confirmation-email-resend.event';
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
    private eventBus: EventBus,
    private emailService: EmailService,
  ) {}

  async execute({ email }: RegistrationEmailResendingCommand): Promise<void> {
    const user = await this.usersCommandsRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException([{ field: 'email', message: 'Email is incorrect' }]);
    }

    // @ts-ignore
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([{ field: 'email', message: 'Code has been applied' }]);
    }
    
    const emailConfirmation: UserEmailConfirmationDto = User.generateEmailConfirmationDetails();
    
    // @ts-ignore
    await this.usersCommandsRepository.updateUserEmailConfirmation(user._id.toString(), emailConfirmation);

    const message = this.emailService.getEmailMessageTemplate(
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
