import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { AppError } from './app-error';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest();

        let status: number;
        let response: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            response = exception.getResponse();
            
            // HttpException 로깅
            this.logger.error(
                'HttpException',
                `HTTP Exception: ${exception.message}`,
                exception.stack,
                `${req.method} ${req.url}`
            );
        } 
        
        else if (exception instanceof AppError) {
            // RFC 7807 Problem Details 형식 사용 (클라이언트 응답용)
            const problemDetails = exception.toProblemDetails(req.url);
            
            status = problemDetails.status;
            response = problemDetails;
            
            // RFC 7807 Content-Type 설정
            res.setHeader('Content-Type', 'application/problem+json');
            
            // AppError 로깅 (내부 정보 포함)
            const logDetails = exception.toLogDetails(req.url);
            this.logger.error(
                'App Error',
                `App Error [${exception.kind}:${exception.code}]: ${exception.message}`,
                JSON.stringify(logDetails, null, 2),
                `${req.method} ${req.url}`,
                
            );
        }  

        
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            response = { 
                type: '/errors/internal/unknown',
                title: 'Internal Server Error',
                status: 500,
                detail: 'An unexpected error occurred',
                instance: req.url,
                timestamp: new Date().toISOString()
            };
            res.setHeader('Content-Type', 'application/problem+json');
            
            // 알 수 없는 에러 로깅 (스택 정보 포함)
            const logDetails = exception.toProblemDetails(req.url);
            this.logger.error(
                'Other Errors',
                `Unknown Error: ${exception?.message || 'No message'}`,
                exception?.stack || 'No stack trace',
                `${req.method} ${req.url}`
            );
        }

        res.status(status).json(response);
    }
}