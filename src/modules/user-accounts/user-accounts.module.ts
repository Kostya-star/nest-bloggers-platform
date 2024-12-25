import { Module } from '@nestjs/common';
import { User, UserSchema } from './users/domain/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/api/users.controller';
import { UsersCommandsRepository } from './users/infrastructure/users-commands-repository';
import { UsersQueryRepository } from './users/infrastructure/users-query.repository';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
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

const repositories = [UsersCommandsRepository, UsersQueryRepository];
const commands = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegisterUserUseCase,
  ConfirmUserRegistrationUseCase,
  RegistrationEmailResendingUseCase,
  LoginUserUseCase,
  UserPasswordRecoveryUseCase,
  UserNewPasswordUseCase,
];
const guards = [JwtAuthGuard, BasicAuthGuard];

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
  exports: [UsersCommandsRepository, UsersQueryRepository],
})
export class UserAccountsModule {}
