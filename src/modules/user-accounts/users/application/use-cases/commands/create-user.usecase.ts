import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from '../../../api/input-dto/create-user-input.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UsersCommandsRepository } from '../../../infrastructure/users-commands-repository';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../../../api/input-dto/create-user.dto';
import { UserEmailConfirmationDto } from 'src/modules/user-accounts/users/dto/user-email-confirmation.dto';

export class CreateUserCommand {
  constructor(
    public user: CreateUserInputDto,
    public emailConfirmation?: UserEmailConfirmationDto,
  ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, number> {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}

  async execute(command: CreateUserCommand): Promise<number> {
    const { email, login, password } = command.user;
    const emailConfirmation = command.emailConfirmation;

    const [userWithSameLogin, userWithSameEmail] = await Promise.all([
      this.usersCommandsRepository.findUserByLogin(login),
      this.usersCommandsRepository.findUserByEmail(email),
    ]);

    if (userWithSameLogin || userWithSameEmail) {
      const field = userWithSameLogin ? 'login' : 'email';
      const message = `${field} already exists`;

      throw new BadRequestException([{ field, message }]);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: CreateUserDto = {
      login,
      email,
      hashedPassword,
      emailConfirmationCode: emailConfirmation?.code ?? null,
      emailConfirmationExpDate: emailConfirmation?.expDate ?? null,
      emailConfirmationIsConfirmed: emailConfirmation?.isConfirmed ?? true,
    };

    return await this.usersCommandsRepository.createUser(newUser);
  }
}
