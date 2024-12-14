import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { User, UserSchema } from './domain/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './application/users.service';
import { UsersCommandsRepository } from './infrastructure/users-commands-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersCommandsRepository, UsersQueryRepository],
  exports: [],
})
export class UserAccountsModule {}
