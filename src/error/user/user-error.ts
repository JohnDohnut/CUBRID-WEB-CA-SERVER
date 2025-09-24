import { AppError } from '@error/app-error';
import { UserErrorCode } from '@error/user/user-error-code';

export { UserErrorCode };

/**
 * Error class for user-related operations.
 * 
 * @category Errors
 * @since 1.0.0
 */
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

    static OldPasswordMismatch(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.OLD_PASSWORD_MISMATCH, additionalData, originalError);
    }

    static BadNewPassword(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.BAD_NEW_PASSWORD, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new UserError("USER", UserErrorCode.UNKNOWN, additionalData, originalError);
    }

}

