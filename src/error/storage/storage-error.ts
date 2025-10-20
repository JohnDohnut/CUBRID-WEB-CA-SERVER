import { AppError } from '@error/app-error';
import { StorageErrorCode } from '@error/storage/storage-error-code';

export { StorageErrorCode };

/**
 * Error class for storage-related operations.
 *
 * @category Errors
 * @since 1.0.0
 */
export class StorageError extends AppError {
    static NotFound(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new StorageError(
            'STORAGE',
            StorageErrorCode.FILE_NOT_FOUND,
            additionalData,
            originalError,
        );
    }

    static PermissionDenied(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new StorageError(
            'STORAGE',
            StorageErrorCode.PERMISSION_DENIED,
            additionalData,
            originalError,
        );
    }

    static AlreadyExists(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new StorageError(
            'STORAGE',
            StorageErrorCode.FILE_ALREADY_EXISTS,
            additionalData,
            originalError,
        );
    }

    static Unknown(
        additionalData?: Record<string, any>,
        originalError?: Error,
    ) {
        return new StorageError(
            'STORAGE',
            StorageErrorCode.UNKNOWN,
            additionalData,
            originalError,
        );
    }
}
