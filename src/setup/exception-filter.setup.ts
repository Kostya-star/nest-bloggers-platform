import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/core/exceptions/filters/all-exceptions.filter';
import { BadRequestExceptionFilter } from 'src/core/exceptions/filters/bad-request-exception.filter';

export function exceptionFiltersSetup(app: INestApplication) {
  // the order of execution from right to left!
  app.useGlobalFilters(new AllExceptionsFilter(), new BadRequestExceptionFilter());
}
