import { DatabaseError } from '@error/database/database-error';
import { HostError, HostErrorCode, CmsError, AppError } from '@error/index';

/**
 * A method decorator that wraps database service methods in a try...catch block.
 * 데이터베이스 서비스 메서드를 try...catch 블록으로 감싸는 메서드 데코레이터입니다.
 *
 * It provides centralized handling for database-related operations, ensuring that
 * infrastructure and domain errors are properly translated to DatabaseError.
 *
 * 데이터베이스 관련 작업에 대한 중앙 집중식 처리를 제공하여
 * 인프라 및 도메인 오류가 적절히 DatabaseError로 변환되도록 합니다.
 *
 * This decorator handles various error types:
 * - HostError: Converted to specific DatabaseError based on error code
 *   - NO_SUCH_HOST → DatabaseError.HostNotFound
 *   - INTERNAL_ERROR → DatabaseError.InternalError
 *   - Others → DatabaseError.HostError
 * - CmsError: Converted to DatabaseError (CMS communication issues)
 * - DatabaseError: Passed through as-is
 * - Unknown errors: Converted to DatabaseError.InternalError
 *
 * 이 데코레이터는 다양한 오류 유형을 처리합니다:
 * - HostError: 에러 코드에 따라 구체적인 DatabaseError로 변환
 *   - NO_SUCH_HOST → DatabaseError.HostNotFound
 *   - INTERNAL_ERROR → DatabaseError.InternalError
 *   - 기타 → DatabaseError.HostError
 * - CmsError: DatabaseError로 변환 (CMS 통신 문제)
 * - DatabaseError: 그대로 전달
 * - 알 수 없는 오류: DatabaseError.InternalError로 변환
 *
 * @category Decorators
 * @since 1.0.0
 * @example
 * ```typescript
 * class CmsDatabaseService {
 *   @HandleDatabaseErrors()
 *   async startDatabase(userId: string, hostUid: string, dbname: string): Promise<boolean> {
 *     // Database operation logic
 *     // 데이터베이스 작업 로직
 *   }
 * }
 * ```
 */
export function HandleDatabaseErrors() {
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
                // DatabaseError는 그대로 전달
                if (err instanceof DatabaseError) {
                    throw err;
                }

                // HostError를 DatabaseError로 변환 (호스트 에러 종류에 따라 구체적으로 변환)
                if (err instanceof HostError) {
                    switch (err.code) {
                        case HostErrorCode.NO_SUCH_HOST:
                            throw DatabaseError.HostNotFound(
                                {
                                    hostErrorCode: err.code,
                                    ...err.additionalData,
                                },
                                err,
                            );
                        case HostErrorCode.INTERNAL_ERROR:
                            throw DatabaseError.InternalError(
                                {
                                    originalError: 'HostError',
                                    hostErrorCode: err.code,
                                    ...err.additionalData,
                                },
                                err,
                            );
                        default:
                            // 기타 HostError는 일반적인 HostError로 변환
                            throw DatabaseError.HostError(
                                {
                                    hostErrorCode: err.code,
                                    ...err.additionalData,
                                },
                                err,
                            );
                    }
                }

                // CmsError를 DatabaseError로 변환
                if (err instanceof CmsError) {
                    throw DatabaseError.GetStartInfoFailed(
                        {
                            originalError: 'CmsError',
                            cmsErrorCode: err.code,
                            ...err.additionalData,
                        },
                        err,
                    );
                }

                // AppError는 일반적인 DatabaseError로 변환
                if (err instanceof AppError) {
                    throw DatabaseError.GetStartInfoFailed(
                        {
                            originalError: err.kind,
                            originalCode: err.code,
                            ...err.additionalData,
                        },
                        err,
                    );
                }

                // 알 수 없는 에러는 InternalError로 변환
                throw DatabaseError.InternalError(
                    {
                        message: err?.message || 'Unknown error',
                    },
                    err,
                );
            }
        };
    };
}

