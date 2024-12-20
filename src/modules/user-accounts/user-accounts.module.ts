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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: 600 },
      }),
      inject: [ConfigService],
    }),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersCommandsRepository, UsersQueryRepository, AuthService, JwtAuthGuard],
  exports: [],
})
export class UserAccountsModule {}
