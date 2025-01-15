import { Injectable } from '@nestjs/common';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { UserViewDto } from '../api/view-dto/users-view.dto';
import { GetMeViewDto } from '../api/view-dto/get-me-view.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.schema-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // async getAllUsers(query: GetUsersQueryParams): Promise<BasePaginatedView<UserViewDto>> {
  //   const { pageNumber: page, pageSize, sortBy, searchEmailTerm, searchLoginTerm, sortDirection } = query;

  //   const skip = (page - 1) * pageSize;

  //   const users = await this.dataSource.query<User[]>(
  //     `
  //       SELECT * FROM users
  //       WHERE login ILIKE '%' || $1 || '%'
  //       OR
  //       email ILIKE '%' || $2 || '%'
  //       ORDER BY ${sortBy} ${sortDirection}
  //       LIMIT $3 OFFSET ${skip}
  //     `,
  //     [searchLoginTerm || '', searchEmailTerm || '', pageSize],
  //   );

  //   const totalCountRes = await this.dataSource.query<{ count: string }[]>(
  //     `
  //       SELECT COUNT(*) FROM users
  //       WHERE login ILIKE '%' || $1 || '%'
  //       OR
  //       email ILIKE '%' || $2 || '%'
  //     `,
  //     [searchLoginTerm || '', searchEmailTerm || ''],
  //   );

  //   const totalCount = parseInt(totalCountRes[0].count);

  //   const pagesCount = Math.ceil(totalCount / pageSize);

  //   return {
  //     pagesCount,
  //     page,
  //     pageSize,
  //     totalCount,
  //     items: users.map((u) => new UserViewDto(u)),
  //   };
  // }

  async getAllUsers(query: GetUsersQueryParams): Promise<BasePaginatedView<UserViewDto>> {
    const { pageNumber: page, pageSize, sortBy, sortDirection, searchEmailTerm = '', searchLoginTerm = '' } = query;

    const skip = (page - 1) * pageSize;

    const [users, totalCount] = await this.usersRepository.findAndCount({
      where: [{ login: `ILIKE '%${searchLoginTerm}%'` }, { email: `ILIKE '%${searchEmailTerm}%'` }],
      order: { [sortBy]: sortDirection },
      skip,
      take: pageSize,
    });

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: users.map((user) => new UserViewDto(user)),
    };
  }

  async getUserById(userId: number): Promise<UserViewDto | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user ? new UserViewDto(user) : null;
  }

  async getMe(meId: number): Promise<GetMeViewDto | null> {
    const me = await this.usersRepository.findOne({ where: { id: meId } });
    return me ? new GetMeViewDto(me) : null;
  }
}
