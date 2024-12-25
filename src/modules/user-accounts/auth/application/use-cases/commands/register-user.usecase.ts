import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from 'src/modules/user-accounts/users/api/input-dto/create-user-input.dto';
import { CreateUserCommand } from 'src/modules/user-accounts/users/application/use-cases/commands/create-user.usecase';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UserRegisteredConfirmationEmailEvent } from 'src/modules/notifications/events/user-registered-confirmation-email.event';
import { EmailService } from 'src/modules/notifications/email.service';
import { User } from 'src/modules/user-accounts/users/domain/user.schema';
import { UserEmailConfirmationDto } from 'src/modules/user-accounts/users/dto/user-email-confirmation.dto';
export class RegisterUserCommand {
  constructor(public userBody: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand, void> {
  constructor(
    private commandBus: CommandBus,
    private eventBus: EventBus,
    private emailService: EmailService,
  ) {}

  async execute({ userBody }: RegisterUserCommand): Promise<void> {
    const emailConfirmation: UserEmailConfirmationDto = User.generateEmailConfirmationDetails();

    await this.commandBus.execute<CreateUserCommand, MongooseObjtId>(
      new CreateUserCommand(userBody, emailConfirmation),
    );

    const message = this.emailService.getEmailMessageTemplate(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    this.eventBus.publish(
      new UserRegisteredConfirmationEmailEvent(
        "'Igor' kostya.danilov.99@mail.ru",
        userBody.email,
        'Registration Confirmation',
        message,
      ),
    );
  }
}
