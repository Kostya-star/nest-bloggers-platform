import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  await appContext.close();

  const DynamicAppModule = AppModule.forRoot(coreConfig);

  const app = await NestFactory.create<NestExpressApplication>(DynamicAppModule, { abortOnError: false });

  app.use(cookieParser());
  app.set('trust proxy', true); // to correctly extract user id from req.id

  appSetup(app, coreConfig);

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
