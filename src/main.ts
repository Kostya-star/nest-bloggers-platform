import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  appSetup(app);
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();