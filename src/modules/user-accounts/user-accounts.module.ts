import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/api/users.controller';
import { UsersCommandsRepository } from './users/infrastructure/users-commands-repository';
import { UsersQueryRepository } from './users/infrastructure/users-query.repository';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { BasicAuthGuard } from 'src/core/guards/basic-auth.guard';
import { CoreConfig } from 'src/core/core.config';
import { CreateUserUseCase } from './users/application/use-cases/commands/create-user.usecase';
import { DeleteUserUseCase } from './users/application/use-cases/commands/delete-user.usecase';
import { RegisterUserUseCase } from './auth/application/use-cases/commands/register-user.usecase';
import { ConfirmUserRegistrationUseCase } from './auth/application/use-cases/commands/confirm-user-registration.usecase';
import { RegistrationEmailResendingUseCase } from './auth/application/use-cases/commands/registration-email-resending.usecase';
import { LoginUserUseCase } from './auth/application/use-cases/commands/login-user.usecase';
import { UserPasswordRecoveryUseCase } from './auth/application/use-cases/commands/user-password-recovery.usecase';
import { UserNewPasswordUseCase } from './auth/application/use-cases/commands/user-new-password.usecase';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './auth/const/auth-tokens-consts.injection';
import { UserAccountsConfig } from './config/user-accounts.config';
import { Device, DeviceSchema } from './devices/domain/device.schema';
import { DevicesCommandsRepository } from './devices/infrastructure/devices-commands.repository';
import { RefreshTokenUseCase } from './auth/application/use-cases/commands/refresh-token.usecase';
import { LogoutUserUseCase } from './auth/application/use-cases/commands/logout-user.usecase';
import { DevicesQueryRepository } from './devices/infrastructure/devices-query.repository';
import { DevicesController } from './devices/api/devices.controller';
import { TerminateUserDeviceUseCase } from './devices/application/use-cases/commands/terminate-user-device-by-device-id.usecase';
import { TerminateOtherUserDevicesUseCase } from './devices/application/use-cases/commands/terminate-other-user-devices-except-current.usecase';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/domain/user.schema-typeorm';

const repositories = [UsersCommandsRepository, UsersQueryRepository, DevicesCommandsRepository, DevicesQueryRepository];
const commands = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegisterUserUseCase,
  ConfirmUserRegistrationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUserUseCase,
  UserPasswordRecoveryUseCase,
  UserNewPasswordUseCase,
  RefreshTokenUseCase,
  LogoutUserUseCase,
  TerminateUserDeviceUseCase,
  TerminateOtherUserDevicesUseCase,
];
const guards = [JwtAuthGuard, BasicAuthGuard];

@Module({
  imports: [
    JwtModule,
    NotificationsModule,
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    TypeOrmModule.forFeature([User]),
    // __ASK__
    // ThrottlerModule.forRootAsync({
    //   inject: [UserAccountsConfig],
    //   // imports: [forwardRef(() => UserAccountsConfig)],
    //   imports: [ConfigModule],
    //   useFactory: (userAccountConfig: UserAccountsConfig) => [
    //     {
    //       ttl: +userAccountConfig.authRequestsTtl,
    //       limit: +userAccountConfig.authRequestsLimitWithinTtl,
    //     },
    //   ],
    // }),
    // __ASK__
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: +configService.get('AUTH_REQUESTS_TTL_MS'),
          limit: +configService.get('AUTH_REQUESTS_LIMIT_WITHIN_TTL'),
        },
      ],
    }),
  ],
  controllers: [UsersController, AuthController, DevicesController],
  providers: [
    ...repositories,
    ...guards,
    ...commands,
    // inject the same instance of JwtService into both strategies
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (coreConfig: CoreConfig, userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpiresIn },
        });
      },
      inject: [CoreConfig, UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (coreConfig: CoreConfig, userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: coreConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpiresIn },
        });
      },
      inject: [CoreConfig, UserAccountsConfig],
    },
    UserAccountsConfig,
  ],
  exports: [UsersCommandsRepository, DevicesCommandsRepository, UsersQueryRepository],
})
export class UserAccountsModule {}
