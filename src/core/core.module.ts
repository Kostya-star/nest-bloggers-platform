import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './core.config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  imports: [CqrsModule],
  exports: [CoreConfig, CqrsModule],
  providers: [JwtAuthGuard, CoreConfig],
})
export class CoreModule {}
