import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  await appContext.close();

  const DynamicAppModule = AppModule.forRoot(coreConfig);

  const app = await NestFactory.create(DynamicAppModule, { abortOnError: false });

  appSetup(app, coreConfig);

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
