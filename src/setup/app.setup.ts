import { INestApplication } from '@nestjs/common';
import { exceptionFiltersSetup } from './exception-filter.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swaggerSetup';
import { CoreConfig } from 'src/core/core.config';
import { validationConstraintSetup } from './validation-constraint.setup';

export async function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  pipesSetup(app);
  // globalPrefixSetup(app);
  swaggerSetup(app, coreConfig);
  await validationConstraintSetup(app, coreConfig);
  exceptionFiltersSetup(app);
}
