import { Module } from '@nestjs/common';
import { User, UserSchema } from './users/domain/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users/application/users.service';
import { UsersController } from './users/api/users.controller';
import { UsersCommandsRepository } from './users/infrastructure/users-commands-repository';
import { UsersQueryRepository } from './users/infrastructure/users-query.repository';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './auth/application/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), NotificationsModule],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersCommandsRepository, UsersQueryRepository, AuthService],
  exports: [],
})
export class UserAccountsModule {}
