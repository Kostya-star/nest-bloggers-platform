import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../../api/input-dto/new-password-input.dto';
import { UsersCommandsRepository } from 'src/modules/user-accounts/users/infrastructure/users-commands-repository';
import { BadRequestException } from '@nestjs/common';
import { isAfter } from 'date-fns';
import bcrypt from 'bcrypt';
import { User } from 'src/modules/user-accounts/users/domain/user.schema-typeorm';

export class UserNewPasswordCommand {
  constructor(public body: NewPasswordInputDto) {}
}

@CommandHandler(UserNewPasswordCommand)
export class UserNewPasswordUseCase implements ICommandHandler<UserNewPasswordCommand, void> {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}
  async execute({ body }: UserNewPasswordCommand): Promise<void> {
    const { recoveryCode, newPassword } = body;

    const user = await this.usersCommandsRepository.findUserByPasswordRecoveryCode(recoveryCode);

    if (!user) {
      throw new BadRequestException([{ field: 'recoveryCode', message: 'Code is incorrect' }]);
    }

    const isExpired = isAfter(new Date(), user.passwordRecoveryExpDate!);

    if (isExpired) {
      throw new BadRequestException([{ field: 'recoveryCode', message: 'Code has expired' }]);
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updates: Partial<User> = {
      hashedPassword: newHashedPassword,
      passwordRecoveryCode: null,
      passwordRecoveryExpDate: null,
    };

    await this.usersCommandsRepository.updateUser(user.id, updates);
  }
}
