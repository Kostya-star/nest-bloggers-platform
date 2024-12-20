import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEmailConfirmationDto } from '../api/input-dto/user-email-confirmation.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UsersCommandsRepository } from '../infrastructure/users-commands-repository';
import bcrypt from 'bcrypt';
import { CreateUserInputDto } from '../api/input-dto/create-user-input.dto';
import { CreateUserDto } from '../api/input-dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersCommandsRepository: UsersCommandsRepository) {}

  async createUser(user: CreateUserInputDto, emailConfirmation?: UserEmailConfirmationDto): Promise<MongooseObjtId> {
    const { email, login, password } = user;

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
      // emailConfirmation and passowrdConfirmation - default values
      emailConfirmation,
    };

    return await this.usersCommandsRepository.createUser(newUser);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.usersCommandsRepository.deleteUser(userId);
  }

  // async updateUserById(userId: MongooseObjtId, newUser: Partial<IUserDB>): Promise<void> {
  //   if (!ObjectId.isValid(userId)) {
  //     throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  //   }

  //   const userToUpdate = await this.usersRepository.getUserById(userId);

  //   if (!userToUpdate) {
  //     throw ErrorService(UsersErrorsList.NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND_404);
  //   }

  //   await this.usersRepository.updateUserById(userId, newUser);
  // }

  // async deleteUser(userId: string): Promise<void> {
  //   await this.usersCommandsRepository.deleteUser(userId);
  // }
}
