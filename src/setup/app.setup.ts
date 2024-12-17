import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { exceptionFiltersSetup } from './exception-filter.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  // globalPrefixSetup(app);
  // swaggerSetup(app);
  exceptionFiltersSetup(app);
}
