import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isDev = process.env.NODE_ENV !== 'production';

    // Base error shape — same structure every time
    const errorResponse = (
      statusCode: number,
      error: string,
      message: string,
      detail?: string,
    ) => {
      const body: Record<string, any> = {
        statusCode,
        error,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      if (detail && isDev) body.detail = detail;
      return response.status(statusCode).json(body);
    };

    // Case 1: clean NestJS HTTP exceptions (404, 400, 401, 409, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as any;
      let message = typeof res === 'string'
        ? res
        : Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message ?? 'Error';

      // User-friendly overrides
      if (status === HttpStatus.UNAUTHORIZED && (message === 'Unauthorized' || message === 'Unauthorized')) {
        message = 'Your session has expired or is invalid. Please log in again.';
      } else if (status === HttpStatus.FORBIDDEN) {
        message = 'You do not have permission to perform this action.';
      } else if (status === HttpStatus.BAD_REQUEST && message.includes('should not exist')) {
        message = 'Invalid data submitted. Modification of protected fields detected. Please refresh the page and try again.';
      }

      return errorResponse(status, res.error ?? 'Error', message);
    }

    // Case 2: TypeORM/MySQL query errors
    if (exception instanceof QueryFailedError) {
      const err = exception as any;

      if (err.errno === 1062) {
        return errorResponse(
          HttpStatus.CONFLICT,
          'Conflict',
          'A record with this value already exists.',
          err.sqlMessage,
        );
      }

      if (err.errno === 1452) {
        return errorResponse(
          HttpStatus.BAD_REQUEST,
          'Bad Request',
          'Referenced record does not exist.',
          err.sqlMessage,
        );
      }
    }

    // Case 3: completely unexpected — log full stack in dev, hide in prod
    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    return errorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      isDev
        ? (exception instanceof Error ? exception.message : String(exception))
        : 'An unexpected error occurred.',
    );
  }
}