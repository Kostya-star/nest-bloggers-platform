import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (exception as any).message || 'Internal server error',
      statusCode: status,
      // code: exception.code || 'UNKNOWN_ERROR',
      // extensions: ,
    });
  }
}
