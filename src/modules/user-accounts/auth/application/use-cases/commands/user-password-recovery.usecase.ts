import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryInputDto } from '../../../api/input-dto/password-recovery-input.dto';
import { EmailService } from 'src/modules/notifications/email.service';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { EmailConfirmationDto } from '../../../dto/email-confirmation.dto';
import { EmailMessageDto } from '../../../dto/email-message.dto';

export class UserPasswordRecoveryCommand {
  constructor(public body: PasswordRecoveryInputDto) {}
}

@CommandHandler(UserPasswordRecoveryCommand)
export class UserPasswordRecoveryUseCase implements ICommandHandler<UserPasswordRecoveryCommand> {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private emailService: EmailService,
  ) {}
  async execute({ body }: UserPasswordRecoveryCommand): Promise<void> {
    const { email } = body;

    const user = await this.usersCommandsRepository.findUserByEmail(email);

    const passwordConfirmation = new EmailConfirmationDto();

    if (user) {
      await this.usersCommandsRepository.updateUserPasswordRecovery(user._id.toString(), passwordConfirmation);
    } else return;

    const message = EmailMessageDto.create(
      'password-recovery',
      'Recover password',
      'recoveryCode',
      passwordConfirmation.code!,
    );

    this.emailService.sendMail("'Kolya' kostya.danilov.99@mail.ru", email, 'Recover password', message);
  }
}
