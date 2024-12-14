import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersQueryParams } from './input.dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UserViewDto } from './view.dto/users-view.dto';

@Controller('users')
export class UsersController {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  @Get()
  async getAllUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<BasePaginatedView<UserViewDto>> {
    return await this.usersQueryRepository.getAllUsers(query);
  }
}
