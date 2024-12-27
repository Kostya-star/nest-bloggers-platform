import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { configValidationUtility } from 'src/core/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set ACCESS_TOKEN_EXPIRES_IN env variable, examples: 1h, 5m, 2d',
  })
  accessTokenExpiresIn: string = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');

  @IsNotEmpty({
    message: 'Set REFRESH_TOKEN_EXPIRES_IN env variable, examples: 1h, 5m, 2d',
  })
  refreshTokenExpiresIn: string = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');

  @IsNotEmpty({
    message: 'Set AUTH_REQUESTS_TTL_MS env variable',
  })
  // @IsNumber()
  authRequestsTtl: string = this.configService.get('AUTH_REQUESTS_TTL_MS');

  @IsNotEmpty({
    message: 'Set AUTH_REQUESTS_LIMIT_WITHIN_TTL env variable',
  })
  // @IsNumber()
  authRequestsLimitWithinTtl: string = this.configService.get('AUTH_REQUESTS_LIMIT_WITHIN_TTL');
}
