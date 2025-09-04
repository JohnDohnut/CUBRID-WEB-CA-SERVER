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
import { StorageError, StorageErrorCode } from './storage/storage-error';
import { LockError, LockErrorCode } from './lock/lock-error';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
    private mapDomainErrorToHttpStatus(error: AppError): { status: number; message: string; code: string } {
        switch (error.kind) {
            case 'STORAGE':
                return this.mapStorageErrorToHttpStatus(error as StorageError);
            case 'LOCK':
                return this.mapLockErrorToHttpStatus(error as LockError);
            case 'AUTH':
                return { status: HttpStatus.UNAUTHORIZED, message: 'Authentication required', code: error.code };
            case 'RESOURCE':
                return { status: HttpStatus.BAD_REQUEST, message: 'Resource constraint violated', code: error.code };
            case 'INTERNAL':
            default:
                return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error', code: error.code };
        }
    }

    private mapStorageErrorToHttpStatus(error: StorageError): { status: number; message: string; code: string } {
        switch (error.code) {
            case StorageErrorCode.FILE_NOT_FOUND:
                return { status: HttpStatus.NOT_FOUND, message: 'Resource not found', code: error.code };
            case StorageErrorCode.PERMISSION_DENIED:
                return { status: HttpStatus.FORBIDDEN, message: 'Access denied', code: error.code };
            case StorageErrorCode.FILE_ALREADY_EXISTS:
                return { status: HttpStatus.CONFLICT, message: 'Request cannot be processed', code: error.code };
            case StorageErrorCode.UNKNOWN:
            default:
                return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An error occurred', code: error.code };
        }
    }

    private mapLockErrorToHttpStatus(error: LockError): { status: number; message: string; code: string } {
        switch (error.code) {
            case LockErrorCode.LOCK_NOT_FOUND:
            case LockErrorCode.FILE_NOT_FOUND:
                return { status: HttpStatus.NOT_FOUND, message: 'Resource not found', code: error.code };
            case LockErrorCode.PERMISSION_DENIED:
                return { status: HttpStatus.FORBIDDEN, message: 'Access denied', code: error.code };
            case LockErrorCode.LOCK_ALREADY_HELD:
                return { status: HttpStatus.CONFLICT, message: 'Request cannot be processed', code: error.code };
            case LockErrorCode.STALE_LOCK:
                return { status: HttpStatus.CONFLICT, message: 'Request cannot be processed', code: error.code };
            case LockErrorCode.UNKNOWN:
            default:
                return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'An error occurred', code: error.code };
        }
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let status: number;
        let response: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            response = exception.getResponse();
        } else if (exception instanceof AppError) {
            const mappedError = this.mapDomainErrorToHttpStatus(exception);
            status = mappedError.status;
            response = {
                message: mappedError.message,
                code: mappedError.code,
                details: exception.details,
            };
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            response = { 
                message: 'An error occurred', 
                code: 'INTERNAL_ERROR' 
            };
        }

        const responseObj = typeof response === 'object' && response !== null
            ? response
            : { message: response };

        res.status(status).json({
            success: false,
            ...responseObj,
        });
    }
}