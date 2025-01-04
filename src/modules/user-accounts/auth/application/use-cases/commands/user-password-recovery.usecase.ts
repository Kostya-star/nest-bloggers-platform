import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryInputDto } from '../../../api/input-dto/password-recovery-input.dto';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { UserPasswordRecoveryEmailEvent } from 'src/modules/notifications/events/user-password-recovery-email.event';
import { EmailService } from 'src/modules/notifications/email.service';
import { User } from 'src/modules/user-accounts/users/domain/user.schema';
import { UserPasswordRecoveryDto } from 'src/modules/user-accounts/users/dto/user-password-recovery.dto';

export class UserPasswordRecoveryCommand {
  constructor(public body: PasswordRecoveryInputDto) {}
}

@CommandHandler(UserPasswordRecoveryCommand)
export class UserPasswordRecoveryUseCase implements ICommandHandler<UserPasswordRecoveryCommand> {
  constructor(
    private usersCommandsRepository: UsersCommandsRepository,
    private eventsBus: EventBus,
    private emailService: EmailService,
  ) {}
  async execute({ body }: UserPasswordRecoveryCommand): Promise<void> {
    const { email } = body;

    const user = await this.usersCommandsRepository.findUserByEmail(email);

    const { code, expDate }: UserPasswordRecoveryDto = User.generatePasswordRecoveryDetails();

    if (user) {
      await this.usersCommandsRepository.updateUser(user.id.toString(), {
        password_recovery_code: code,
        password_recovery_exp_date: expDate,
      });
    } else return;

    const message = this.emailService.getEmailMessageTemplate(
      'password-recovery',
      'Recover password',
      'recoveryCode',
      code,
    );

    this.eventsBus.publish(
      new UserPasswordRecoveryEmailEvent("'Kolya' kostya.danilov.99@mail.ru", email, 'Recover password', message),
    );
  }
}
