import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { CoreConfig } from 'src/core/core.config';

export function swaggerSetup(app: INestApplication, coreConfig: CoreConfig) {
  if (!coreConfig.isSwaggerEnabled) return;

  const config = new DocumentBuilder()
    .setTitle('Bloggers API')
    .setDescription('Basic auth- login: admin, password: qwerty')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth()
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'basicAuth',
    )
    .build();

  // make sure that the library generates operation names like createUser instead of UserController_createUser
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('swagger', app, documentFactory);
}
