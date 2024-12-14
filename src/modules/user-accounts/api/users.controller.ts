import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { GetUsersQueryParams } from './input.dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UserViewDto } from './view.dto/users-view.dto';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input.dto/create-user-input.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getAllUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<BasePaginatedView<UserViewDto>> {
    return await this.usersQueryRepository.getAllUsers(query);
  }

  @Post()
  async adminCreatesUser(@Body() userBody: CreateUserInputDto) {
    const userId = await this.usersService.createUser(userBody);
    const user = await this.usersQueryRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
