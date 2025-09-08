import { AppError } from "../app-error";

export enum StorageErrorCode {
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
    UNKNOWN = 'UNKNOWN',
}


export class StorageError extends AppError {

    static NotFound(additionalData?: Record<string, any>, originalError?: Error) {
        return new StorageError("STORAGE", StorageErrorCode.FILE_NOT_FOUND, additionalData, originalError);
    }
    
    static PermissionDenied(additionalData?: Record<string, any>, originalError?: Error) {
        return new StorageError("STORAGE", StorageErrorCode.PERMISSION_DENIED, additionalData, originalError);
    }

    static AlreadyExists(additionalData?: Record<string, any>, originalError?: Error) {
        return new StorageError("STORAGE", StorageErrorCode.FILE_ALREADY_EXISTS, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new StorageError("STORAGE", StorageErrorCode.UNKNOWN, additionalData, originalError);
    }

}