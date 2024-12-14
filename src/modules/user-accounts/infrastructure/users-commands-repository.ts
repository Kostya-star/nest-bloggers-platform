import { Injectable } from '@nestjs/common';
import { RootFilterQuery } from 'mongoose';
import { IUserDocument, IUserModel, User } from '../domain/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../api/input.dto/create-user.dto';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';

@Injectable()
export class UsersCommandsRepository {
  constructor(@InjectModel(User.name) private UserModel: IUserModel) {}
  // async getUserById(userId: MongooseObjtId): Promise<IUserDB | null> {
  //   return await UserModel.findOne({ _id: userId });
  // }

  async findUserByFilter(
    filter: RootFilterQuery<IUserDocument>,
  ): Promise<IUserDocument | null> {
    return await this.UserModel.findOne(filter);
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

  // async deleteUser(userId: MongooseObjtId): Promise<void> {
  //   await this.UserModel.deleteOne({ _id: userId });
  // }
}
