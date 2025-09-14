import { AppError } from "@error/app-error";

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    INVALID_TOKEN = 'INVALID_TOKEN',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    UNKNOWN = 'UNKNOWN',

}

export class AuthError extends AppError {

    static InvalidCredentials(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.INVALID_CREDENTIALS, additionalData, originalError);
    }

    static InternalError(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("INTERNAL", AuthErrorCode.INTERNAL_ERROR, additionalData, originalError);
    }
    
    static PermissionDenied(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.PERMISSION_DENIED, additionalData, originalError);
    }

    static InvalidToken(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.INVALID_TOKEN, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.UNKNOWN, additionalData, originalError);
    }

}
