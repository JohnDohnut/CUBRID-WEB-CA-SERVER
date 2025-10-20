import { AppError } from '../app-error';

export enum RepositoryErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
}

/**
 * Error class for repository-related operations.
 *
 * @category Errors
 * @since 1.0.0
 */
export class RepositoryError extends AppError {
    static UserNotFound(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new RepositoryError(
            'RESOURCE',
            RepositoryErrorCode.USER_NOT_FOUND,
            additionalData,
            originalError,
        );
    }

    static UserAlreadyExists(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new RepositoryError(
            'RESOURCE',
            RepositoryErrorCode.USER_ALREADY_EXISTS,
            additionalData,
            originalError,
        );
    }
}
