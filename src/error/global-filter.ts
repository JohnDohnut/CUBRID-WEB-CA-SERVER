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
import { ValidationError } from './validation';

/**
 * Global exception filter for handling all unhandled exceptions across the application.
 * It catches various types of exceptions (HttpException, AppError, and others)
 * and formats the response according to RFC 7807 Problem Details for AppError instances.
 *
 * 애플리케이션 전반의 모든 처리되지 않은 예외를 처리하기 위한 전역 예외 필터입니다.
 * 다양한 유형의 예외(HttpException, AppError 및 기타)를 catch하고
 * AppError 인스턴스의 경우 RFC 7807 문제 세부 정보에 따라 응답 형식을 지정합니다.
 *
 * @category Errors
 * @since 1.0.0
 */
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

            // Ensure response is an object to add 'result' field
            if (typeof response === 'string') {
                response = { message: response };
            }
            response.result = false; // Add result: false

            // HttpException 로깅
            this.logger.error(
                'HttpException',
                `HTTP Exception: ${exception.message}`,
                exception.stack,
                `${req.method} ${req.url}`,
            );
        } else if (exception instanceof AppError) {
            // RFC 7807 Problem Details 형식 사용 (클라이언트 응답용)
            const problemDetails = exception.toProblemDetails(req.url);

            status = problemDetails.status;
            response = { ...problemDetails, result: false }; // Add result: false

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
                title: 'Internal Server Error',
                status: 500,
                detail: 'An unexpected error occurred',
                result: false, // Add result: false
            };
            res.setHeader('Content-Type', 'application/problem+json');

            // 알 수 없는 에러 로깅 (스택 정보 포함)
            this.logger.error(
                'Other Errors',
                `Unknown Error: ${exception?.message || 'No message'}`,
                exception?.stack || 'No stack trace',
                `${req.method} ${req.url}`,
            );
        }

        res.status(status).json(response);
    }
}
