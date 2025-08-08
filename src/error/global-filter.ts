import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const response = exception instanceof HttpException
            ? exception.getResponse()
            : { message: exception.message || 'Internal server error', code: 'INTERNAL_ERROR' };

            const responseObj = typeof response === 'object' && response !== null
            ? response
            : { message: response };

        res.status(status).json({
            success: false,
            ...responseObj,
        });
    }
}