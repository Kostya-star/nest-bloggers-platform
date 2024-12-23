import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from 'src/core/config-validation.utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

// each module has it's own *.config.ts

@Injectable()
export class CoreConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  port: number = Number(this.configService.get('PORT'));

  @IsNotEmpty({
    message: 'Set Env variable MONGO_URI, example: mongodb://localhost:27017',
  })
  mongoURI: string = this.configService.get('MONGO_URI');

  @IsNotEmpty({
    message: 'Set Env variable MONGO_DB_NAME, example: my-test-db-name',
  })
  mongoDBName: string = this.configService.get('MONGO_DB_NAME');

  @IsEnum(Environments, {
    message:
      'Ser correct NODE_ENV value, available values: ' + configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string = this.configService.get('NODE_ENV');

  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED to enable/disable Swagger, example: true, available values: true, false',
  })
  isSwaggerEnabled = configValidationUtility.convertToBoolean(this.configService.get('IS_SWAGGER_ENABLED')) as boolean;

  // @IsBoolean({
  //   message:
  //     'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  // })
  // includeTestingModule: boolean = configValidationUtility.convertToBoolean(
  //   this.configService.get('INCLUDE_TESTING_MODULE'),
  // ) as boolean;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, dangerous for security!',
  })
  refreshTokenSecret: string = this.configService.get('REFRESH_TOKEN_SECRET');

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, dangerous for security!',
  })
  accessTokenSecret: string = this.configService.get('ACCESS_TOKEN_SECRET');

  @IsNotEmpty({
    message: 'Set Env variable MAIL_SENDER_NAME, dangerous for security!',
  })
  mailSenderName: string = this.configService.get('MAIL_SENDER_NAME');

  @IsNotEmpty({
    message: 'Set Env variable MAIL_SENDER_PASSWORD, dangerous for security!',
  })
  mailSenderPassword: string = this.configService.get('MAIL_SENDER_PASSWORD');

  @IsNotEmpty({
    message: 'Set Env variable BASIC_AUTH_USERNAME, dangerous for security!',
  })
  basicAuthUsername: string = this.configService.get('BASIC_AUTH_USERNAME');

  @IsNotEmpty({
    message: 'Set Env variable BASIC_AUTH_PASSWORD, dangerous for security!',
  })
  basicAuthPassword: string = this.configService.get('BASIC_AUTH_PASSWORD');
}
