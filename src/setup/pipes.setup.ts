import { BadRequestException, INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';

type ErrorResponse = { message: string; field: string };

export const errorFormatter = (errors: ValidationError[], errorMessage?: any): ErrorResponse[] => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error?.constraints) {
      const constrainKeys = Object.keys(error.constraints);

      for (const key of constrainKeys) {
        errorsForResponse.push({
          field: error.property,
          message: error.constraints[key] ? `${error.constraints[key]}; Received value: ${error?.value}` : '',
        });
      }
    }
  }

  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // give first error per field
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const formattedErrors = errorFormatter(errors);
        throw new BadRequestException(formattedErrors);
      },
    }),
  );
}
