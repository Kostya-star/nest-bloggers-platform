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
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CoreConfig } from 'src/core/core.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (coreConfig: CoreConfig) => ({
        secret: coreConfig.accessTokenSecret,
        signOptions: { expiresIn: 600 },
      }),
      inject: [CoreConfig],
    }),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersCommandsRepository, UsersQueryRepository, AuthService, JwtAuthGuard, BasicAuthGuard],
  exports: [],
})
export class UserAccountsModule {}
