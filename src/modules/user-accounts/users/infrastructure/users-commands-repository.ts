import { Injectable } from '@nestjs/common';
import { IUserDocument, IUserModel, User } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../api/input.dto/create-user.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { UserEmailConfirmationDto } from '../api/input.dto/user-email-confirmation.dto';

@Injectable()
export class UsersCommandsRepository {
  constructor(@InjectModel(User.name) private UserModel: IUserModel) {}
  // async getUserById(userId: MongooseObjtId): Promise<IUserDB | null> {
  //   return await UserModel.findOne({ _id: userId });
  // }

  async findUserByLogin(login: string) /*: Promise<IUserDocument | null> */ {
    // __ASK__
    return await this.UserModel.findOne({ login }).lean();
  }

  // __ASK__
  async findUserByEmail(email: string) /*: Promise<IUserDocument | null> */ {
    return await this.UserModel.findOne({ email }).lean();
  }

  // __ASK__
  async findUserByCode(code: string) /*: Promise<IUserDocument | null> */ {
    return await this.UserModel.findOne({ 'emailConfirmation.code': code }).lean();
  }

  async updateUserEmailConfirmation(userId: string, emailConfirmation: UserEmailConfirmationDto): Promise<void> {
    await this.UserModel.updateOne({ _id: userId }, { emailConfirmation });
  }

  async createUser(newUser: CreateUserDto): Promise<MongooseObjtId> {
    const user = await this.UserModel.create(newUser);
    return user._id;
  }

  // async updateUserById(
  //   userId: MongooseObjtId,
  //   updates: Partial<IUserDB>,
  // ): Promise<void> {
  //   // console.log('updates', updates)
  //   await this.UserModel.updateOne({ _id: userId }, updates);
  // }

  async deleteUser(userId: string): Promise<void> {
    await this.UserModel.deleteOne({ _id: userId });
  }
}
