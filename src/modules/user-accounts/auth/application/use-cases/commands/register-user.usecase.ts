import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from 'src/modules/user-accounts/users/api/input-dto/create-user-input.dto';
import { EmailConfirmationDto } from '../../../dto/email-confirmation.dto';
import { CreateUserCommand } from 'src/modules/user-accounts/users/application/use-cases/commands/create-user.usecase';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { EmailMessageDto } from '../../../dto/email-message.dto';
import { EmailService } from 'src/modules/notifications/email.service';

export class RegisterUserCommand {
  constructor(public userBody: CreateUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand, void> {
  constructor(
    private commandBus: CommandBus,
    private emailService: EmailService,
  ) {}

  async execute({ userBody }: RegisterUserCommand): Promise<void> {
    const emailConfirmation = new EmailConfirmationDto();

    await this.commandBus.execute<CreateUserCommand, MongooseObjtId>(new CreateUserCommand(userBody));

    const message = EmailMessageDto.create(
      'registration-confirmation',
      'Confirm registration',
      'code',
      emailConfirmation.code!,
    );

    this.emailService.sendMail(
      "'Igor' kostya.danilov.99@mail.ru",
      userBody.email,
      'Registration Confirmation',
      message,
    );
  }
}
