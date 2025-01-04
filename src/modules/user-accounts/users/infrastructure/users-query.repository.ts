import { Injectable } from '@nestjs/common';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { UserViewDto } from '../api/view-dto/users-view.dto';
import { GetMeViewDto } from '../api/view-dto/get-me-view.dto';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.schema-typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { IUserModel } from '../domain/user.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private UserModel: IUserModel,
    private dataSource: DataSource,
  ) {}

  async getAllUsers(query: GetUsersQueryParams): Promise<BasePaginatedView<UserViewDto>> {
    const { pageNumber: page, pageSize, sortBy, searchEmailTerm, searchLoginTerm, sortDirection } = query;

    const skip = (page - 1) * pageSize;

    const users = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE login ILIKE '%' || $1 || '%'
        OR
        email ILIKE '%' || $2 || '%'
        ORDER BY ${sortBy} ${sortDirection} 
        LIMIT $3 OFFSET ${skip}
      `,
      [searchLoginTerm || '', searchEmailTerm || '', pageSize],
    );

    const totalCountRes = await this.dataSource.query<{ count: string }[]>(
      `
        SELECT COUNT(*) FROM users
        WHERE login ILIKE '%' || $1 || '%'
        OR
        email ILIKE '%' || $2 || '%'
      `,
      [searchLoginTerm || '', searchEmailTerm || ''],
    );

    const totalCount = parseInt(totalCountRes[0].count);

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
    const user = await this.dataSource.query<User[]>(
      `
        SELECT * FROM users
        WHERE id = $1 
      `,
      [userId],
    );
    return user[0] ? new UserViewDto(user[0]) : null;
  }

  async getMe(userId: string): Promise<GetMeViewDto | null> {
    const user = await this.dataSource.query(
      `
        SELECT * FROM users
        WHERE id = $1
      `,
      [userId],
    );
    return user[0] ? new GetMeViewDto(user) : null;
  }
}
