import { AppError } from "../app-error";

export enum UserErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    DATA_SAVE_FAILED = 'DATA_SAVE_FAILED',
    DATA_LOAD_FAILED = 'DATA_LOAD_FAILED',
    DATA_DELETE_FAILED = 'DATA_DELETE_FAILED',
    DATA_UPDATE_FAILED = 'DATA_UPDATE_FAILED',
    RESOURCE_LOCKED = 'RESOURCE_LOCKED',
    LOCK_OPERATION_FAILED = 'LOCK_OPERATION_FAILED',
    UNKNOWN = 'UNKNOWN',
}

export class UserError extends AppError {

    static UserNotFound(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.USER_NOT_FOUND, additionalData, originalError);
    }

    static UserAlreadyExists(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.USER_ALREADY_EXISTS, additionalData, originalError);
    }

    static DataSaveFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.DATA_SAVE_FAILED, additionalData, originalError);
    }

    static DataLoadFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.DATA_LOAD_FAILED, additionalData, originalError);
    }

    static DataDeleteFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.DATA_DELETE_FAILED, additionalData, originalError);
    }

    static DataUpdateFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.DATA_UPDATE_FAILED, additionalData, originalError);
    }

    static ResourceLocked(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.RESOURCE_LOCKED, additionalData, originalError);
    }

    static LockOperationFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.LOCK_OPERATION_FAILED, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.UNKNOWN, additionalData, originalError);
    }

}

