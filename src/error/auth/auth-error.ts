import { AppError } from "@error/app-error";

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    UNKNOWN = 'UNKNOWN',
}

export class AuthError extends AppError {

    static InvalidCredentials(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.INVALID_CREDENTIALS, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new AuthError("AUTH", AuthErrorCode.UNKNOWN, additionalData, originalError);
    }
}
