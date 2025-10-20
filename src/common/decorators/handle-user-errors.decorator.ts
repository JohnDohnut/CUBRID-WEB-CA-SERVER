import {
    UserError,
    LockError,
    StorageError,
    StorageErrorCode,
} from '@root/src/error';

/**
 * A method decorator that wraps user service methods in a try...catch block.
 * 사용자 서비스 메서드를 try...catch 블록으로 감싸는 메서드 데코레이터입니다.
 *
 * It provides centralized handling for LockError and StorageError, translating
 * them into appropriate UserError instances.
 *
 * LockError와 StorageError에 대한 중앙 집중식 처리를 제공하여
 * 적절한 UserError 인스턴스로 변환합니다.
 *
 * This decorator ensures consistent error handling across user-related operations
 * by converting infrastructure-level errors into domain-specific user errors
 * that can be properly handled by the application layer.
 *
 * 이 데코레이터는 인프라 수준의 오류를 애플리케이션 계층에서 적절히 처리할 수 있는
 * 도메인별 사용자 오류로 변환하여 사용자 관련 작업 전반에 걸쳐 일관된 오류 처리를 보장합니다.
 *
 * @category Decorators
 * @since 1.0.0
 * @example
 * ```typescript
 * class UserService {
 *   @HandleUserErrors()
 *   async createUser(userData: UserData): Promise<User> {
 *     // Method implementation
 *     // 메서드 구현
 *   }
 * }
 * ```
 */
export function HandleUserErrors() {
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
                if (err instanceof LockError) {
                    throw UserError.LockOperationFailed({}, err);
                } else if (err instanceof StorageError) {
                    switch (err.code) {
                        case StorageErrorCode.FILE_ALREADY_EXISTS:
                        case StorageErrorCode.PERMISSION_DENIED:
                        case StorageErrorCode.UNKNOWN:
                            throw UserError.Unknown();
                        case StorageErrorCode.FILE_NOT_FOUND:
                            UserError.UserNotFound(
                                err.additionalData || {},
                                err,
                            );
                    }
                } else if (err instanceof UserError) {
                    throw err;
                } else {
                    throw UserError.Unknown({}, err);
                }
            }
        };
    };
}
