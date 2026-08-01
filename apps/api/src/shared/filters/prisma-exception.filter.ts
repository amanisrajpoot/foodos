import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // P2025: Record not found. P2003: Foreign key failed.
    if (exception.code === 'P2025' || exception.code === 'P2003') {
      this.logger.warn(`Prisma error caught (${exception.code}): ${exception.message}`);
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record or relation not found',
        error: 'Not Found'
      });
    }

    // P2007: Data validation error (e.g. invalid UUID format string). P2023: Inconsistent column data.
    if (exception.code === 'P2007' || exception.code === 'P2023' || exception.code === 'P2022') {
      this.logger.warn(`Prisma validation error caught (${exception.code}): ${exception.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input data format (e.g., malformed UUID)',
        error: 'Bad Request'
      });
    }

    // Default to 500 for other Prisma known errors if unhandled specifically
    this.logger.error(`Unhandled Prisma Error ${exception.code}`, exception.stack);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error'
    });
  }
}
