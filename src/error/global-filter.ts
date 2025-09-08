import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { AppError } from './app-error';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let status: number;
        let response: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            response = exception.getResponse();
        } else if (exception instanceof AppError) {
            // RFC 7807 Problem Details 형식 사용
            const ctx = host.switchToHttp();
            const req = ctx.getRequest();
            const problemDetails = exception.toProblemDetails(req.url);
            
            status = problemDetails.status;
            response = problemDetails;
            
            // RFC 7807 Content-Type 설정
            res.setHeader('Content-Type', 'application/problem+json');
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            response = { 
                type: '/errors/internal/unknown',
                title: 'Internal Server Error',
                status: 500,
                detail: 'An unexpected error occurred',
                instance: host.switchToHttp().getRequest().url,
                timestamp: new Date().toISOString()
            };
            res.setHeader('Content-Type', 'application/problem+json');
        }

        res.status(status).json(response);
    }
}