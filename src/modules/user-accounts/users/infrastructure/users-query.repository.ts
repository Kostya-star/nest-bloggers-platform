import { Injectable } from '@nestjs/common';
import { GetUsersQueryParams } from '../api/input.dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { InjectModel } from '@nestjs/mongoose';
import { IUserModel, User } from '../domain/user.schema';
import { FilterQuery } from 'mongoose';
import { UserViewDto } from '../api/view.dto/users-view.dto';
import { GetMeViewDto } from '../api/view.dto/get-me-view.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: IUserModel) {}
  async getAllUsers(query: GetUsersQueryParams): Promise<BasePaginatedView<UserViewDto>> {
    const { pageNumber: page, pageSize, searchEmailTerm, searchLoginTerm } = query;

    const { sortOptions, limit, skip } = query.processQueryParams();

    const searchConditions: FilterQuery<User>[] = [];

    if (searchLoginTerm) {
      searchConditions.push({
        login: { $regex: searchLoginTerm, $options: 'i' },
      });
    }

    if (searchEmailTerm) {
      searchConditions.push({
        email: { $regex: searchEmailTerm, $options: 'i' },
      });
    }

    const queryFilter = searchConditions.length ? { $or: searchConditions } : {};

    const users = await this.UserModel.find(queryFilter).sort(sortOptions).skip(skip).limit(limit);

    const totalCount = await this.UserModel.countDocuments(queryFilter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: users.map((u) => new UserViewDto(u)),
    };
  }

  async getUserById(userId: string): Promise<UserViewDto | null> {
    const user = await this.UserModel.findOne({ _id: userId });
    return user ? new UserViewDto(user) : null;
  }

  async getMe(userId: string): Promise<GetMeViewDto | null> {
    const user = await this.UserModel.findOne({ _id: userId });
    return user ? new GetMeViewDto(user) : null;
  }
}
