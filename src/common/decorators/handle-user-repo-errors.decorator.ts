import { UserError } from '@error/user/user-error';
import { LockError, LockErrorCode } from '@error/lock/lock-error';
import { StorageError, StorageErrorCode } from '@error/storage/storage-error';

/**
 * A method decorator that wraps a repository method in a try...catch block.
 * 리포지토리 메서드를 try...catch 블록으로 감싸는 메서드 데코레이터입니다.
 *
 * It provides centralized handling for LockError and StorageError, translating
 * them into the appropriate domain-specific UserError.
 *
 * LockError와 StorageError에 대한 중앙 집중식 처리를 제공하여
 * 적절한 도메인별 UserError로 변환합니다.
 *
 * @assumption This decorator assumes that the first argument of the decorated
 * method is a string (e.g., userId) that can be used for logging context.
 *
 * @가정 이 데코레이터는 데코레이팅된 메서드의 첫 번째 인수가
 * 로깅 컨텍스트에 사용할 수 있는 문자열(예: userId)이라고 가정합니다.
 *
 * @category Decorators
 * @since 1.0.0
 */
export function HandleUserRepoErrors() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (err) {
                const contextId = args[0] || 'unknown';

                // Handle storage errors first, as they are more specific
                if (err instanceof StorageError) {
                    switch (err.code) {
                        case StorageErrorCode.FILE_NOT_FOUND:
                            throw UserError.UserNotFound(
                                { userId: contextId },
                                err,
                            );
                        case StorageErrorCode.FILE_ALREADY_EXISTS:
                            throw UserError.UserAlreadyExists(
                                { userId: contextId },
                                err,
                            );
                        default:
                            throw UserError.Unknown(
                                {
                                    resourceId: contextId,
                                    storageError: err.code,
                                },
                                err,
                            );
                    }
                }

                // Handle lock errors - but be more specific about when user doesn't exist
                if (err instanceof LockError) {
                    // If it's a lock error but the underlying cause might be user not found
                    if (
                        err.code === LockErrorCode.LOCK_NOT_FOUND &&
                        err.message?.includes('ENOENT')
                    ) {
                        throw UserError.UserNotFound(
                            { userId: contextId },
                            err,
                        );
                    }
                    if (err.code === LockErrorCode.LOCK_ALREADY_HELD) {
                        throw UserError.ResourceLocked(
                            { resourceId: contextId },
                            err,
                        );
                    } else {
                        throw UserError.LockOperationFailed(
                            { resourceId: contextId, reason: err.code },
                            err,
                        );
                    }
                }

                // If it's an unrecognized error, re-throw it to be handled elsewhere.
                throw err;
            }
        };

        return descriptor;
    };
}
