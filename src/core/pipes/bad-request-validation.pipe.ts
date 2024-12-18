import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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

@Injectable()
export class BadRequestValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length) {
      throw new BadRequestException(errorFormatter(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
