import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUsersQueryParams } from './input-dto/get-users-query-params';
import { BasePaginatedView } from 'src/core/dto/base-paginated-view';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { UserViewDto } from './view-dto/users-view.dto';
import { CreateUserInputDto } from './input-dto/create-user-input.dto';
import { ObjectIdValidationPipe } from 'src/core/pipes/object-id-validation.pipe';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/commands/create-user.usecase';
import { MongooseObjtId } from 'src/core/types/mongoose-objectId';
import { DeleteUserCommand } from '../application/use-cases/commands/delete-user.usecase';

@ApiBasicAuth('basicAuth')
@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getAllUsers(@Query() query: GetUsersQueryParams): Promise<BasePaginatedView<UserViewDto>> {
    return await this.usersQueryRepository.getAllUsers(query);
  }

  @Post()
  async adminCreatesUser(@Body() userBody: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<CreateUserCommand, MongooseObjtId>(new CreateUserCommand(userBody));
    const user = await this.usersQueryRepository.getUserById(userId.toString());

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('userId', ObjectIdValidationPipe) userId: string): Promise<void> {
    const user = await this.usersQueryRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
