import { AppError } from '@error/app-error';
import { DatabaseErrorCode } from './database-error-code';

/**
 * Error class for database-related operations.
 * 
 * 데이터베이스 관련 작업을 위한 에러 클래스입니다.
 */
export class DatabaseError extends AppError {
    static GetStartInfoFailed(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new DatabaseError(
            'DATABASE',
            DatabaseErrorCode.GET_START_INFO_FAILED,
            additionalData,
            originalError,
        );
    }

    static StartDatabaseFailed(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new DatabaseError(
            'DATABASE',
            DatabaseErrorCode.START_DATABASE_FAILED,
            additionalData,
            originalError,
        );
    }

    static StopDatabaseFailed(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new DatabaseError(
            'DATABASE',
            DatabaseErrorCode.STOP_DATABASE_FAILED,
            additionalData,
            originalError,
        );
    }

    static RestartDatabaseFailed(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new DatabaseError(
            'DATABASE',
            DatabaseErrorCode.RESTART_DATABASE_FAILED,
            additionalData,
            originalError,
        );
    }
}

