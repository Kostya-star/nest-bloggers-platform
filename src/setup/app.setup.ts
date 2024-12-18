import { INestApplication } from '@nestjs/common';
import { exceptionFiltersSetup } from './exception-filter.setup';
import { pipesSetup } from './pipes.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  // globalPrefixSetup(app);
  // swaggerSetup(app);
  exceptionFiltersSetup(app);
}
