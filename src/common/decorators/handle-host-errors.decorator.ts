import { HostError, LockError, StorageError } from "@root/src/error";

/**
 * A method decorator that wraps host service methods in a try...catch block.
 * 호스트 서비스 메서드를 try...catch 블록으로 감싸는 메서드 데코레이터입니다.
 * 
 * It provides centralized handling for host-related operations, ensuring that
 * infrastructure errors are properly translated to domain-specific errors.
 * 
 * 호스트 관련 작업에 대한 중앙 집중식 처리를 제공하여 
 * 인프라 오류가 도메인별 오류로 적절히 변환되도록 합니다.
 * 
 * This decorator handles various error types:
 * - StorageError: File system related errors
 * - LockError: Concurrency control errors
 * - HostError: Domain-specific host errors
 * - Unknown errors: Converted to HostError.InternalError
 * 
 * 이 데코레이터는 다양한 오류 유형을 처리합니다:
 * - StorageError: 파일 시스템 관련 오류
 * - LockError: 동시성 제어 오류
 * - HostError: 도메인별 호스트 오류
 * - 알 수 없는 오류: HostError.InternalError로 변환
 * 
 * @category Decorators
 * @since 1.0.0
 * @example
 * ```typescript
 * class HostService {
 *   @HandleHostErrors()
 *   async addHost(userId: string, hostInfo: HostInfo): Promise<User> {
 *     // Host management logic
 *     // 호스트 관리 로직
 *   }
 * }
 * ```
 */
export function HandleHostErrors() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (err) {
                const contextId = args[0] || 'unknown';

                if (err instanceof StorageError || err instanceof LockError || err instanceof HostError) {
                    throw err;
                }
                else {
                    throw HostError.InternalError({ userId: contextId }, err)
                }

            }
        }
    }
}

