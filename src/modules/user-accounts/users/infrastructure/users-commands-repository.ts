import { Injectable } from '@nestjs/common';
import { IUserModel, User } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../api/input-dto/create-user.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UserPasswordRecoveryDto } from '../dto/user-password-recovery.dto';
import { UserEmailConfirmationDto } from '../dto/user-email-confirmation.dto';

type UserWithId = User & { _id: MongooseObjtId };

@Injectable()
export class UsersCommandsRepository {
  constructor(@InjectModel(User.name) private UserModel: IUserModel) {}
  async findUserById(userId: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ _id: userId });
  }

  async findUserByLogin(login: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ login }).lean();
  }

  async findUserByEmail(email: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ email }).lean();
  }

  async findUserByEmailConfirmationCode(code: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ 'emailConfirmation.code': code }).lean();
  }

  async findUserByPasswordRecoveryCode(code: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ 'passwordRecovery.code': code }).lean();
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserWithId | null> {
    return await this.UserModel.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] }).lean();
  }

  async updateUserEmailConfirmation(userId: string, emailConfirmation: UserEmailConfirmationDto): Promise<void> {
    await this.UserModel.updateOne({ _id: userId }, { emailConfirmation });
  }

  async updateUserPasswordRecovery(userId: string, passwordRecovery: UserPasswordRecoveryDto): Promise<void> {
    await this.UserModel.updateOne({ _id: userId }, { passwordRecovery });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await this.UserModel.updateOne({ _id: userId }, updates);
  }

  async createUser(newUser: CreateUserDto): Promise<MongooseObjtId> {
    const user = await this.UserModel.create(newUser);
    return user._id;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.UserModel.deleteOne({ _id: userId });
  }
}
