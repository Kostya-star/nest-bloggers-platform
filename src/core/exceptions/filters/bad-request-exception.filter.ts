import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.BAD_REQUEST;

    const exceptionResponse = exception.getResponse();

    const errorsMessages =
      exceptionResponse instanceof Object && 'message' in exceptionResponse ? exceptionResponse['message'] : [];

    console.error({ errorsMessages });

    response.status(status).json({ errorsMessages });
  }
}
