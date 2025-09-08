import { AppError } from "../app-error";

export enum LockErrorCode {
    LOCK_NOT_FOUND = 'LOCK_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    LOCK_ALREADY_HELD = 'LOCK_ALREADY_HELD',
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    STALE_LOCK = 'STALE_LOCK',            
    UNKNOWN = 'UNKNOWN',
  }
  
export class LockError extends AppError {

    static LockNotFound(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.LOCK_NOT_FOUND, additionalData, originalError);
    }

    static PermissionDenied(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.PERMISSION_DENIED, additionalData, originalError);
    }

    static LockAlreadyHeld(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.LOCK_ALREADY_HELD, additionalData, originalError);
    }

    static FileNotFound(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.FILE_NOT_FOUND, additionalData, originalError);
    }

    static StaleLock(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.STALE_LOCK, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.UNKNOWN, additionalData, originalError);
    }

}