import { AppError } from '@error/app-error';
import { LockErrorCode } from '@error/lock/lock-error-code';

export { LockErrorCode };
  
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

    static StaleLock(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.STALE_LOCK, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new LockError("LOCK", LockErrorCode.UNKNOWN, additionalData, originalError);
    }

}