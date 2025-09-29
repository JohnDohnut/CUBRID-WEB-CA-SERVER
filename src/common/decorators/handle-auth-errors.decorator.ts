import { UserError, UserErrorCode } from "@root/src/error";
import { AuthError } from "@root/src/error/auth/auth-error";

/**
 * A method decorator that wraps authentication methods in a try...catch block.
 * 인증 메서드를 try...catch 블록으로 감싸는 메서드 데코레이터입니다.
 * 
 * It provides centralized handling for UserError instances, translating
 * them into appropriate AuthError instances for authentication context.
 * 
 * UserError 인스턴스에 대한 중앙 집중식 처리를 제공하여 
 * 인증 컨텍스트에 적합한 AuthError 인스턴스로 변환합니다.
 * 
 * This decorator handles various user error scenarios and converts them
 * to authentication-specific errors with proper error codes and context.
 * 
 * 이 데코레이터는 다양한 사용자 오류 시나리오를 처리하고 
 * 적절한 오류 코드와 컨텍스트로 인증별 오류로 변환합니다.
 * 
 * @category Decorators
 * @since 1.0.0
 * @example
 * ```typescript
 * class AuthService {
 *   @HandleAuthErrors()
 *   async login(credentials: UserDTO): Promise<string> {
 *     // Authentication logic
 *     // 인증 로직
 *   }
 * }
 * ```
 */
export function HandleAuthErrors() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (err) {
                if (err instanceof AuthError) {
                    throw err;
                }
                else if (err instanceof UserError){
                    switch (err.code) {
                        case UserErrorCode.USER_ALREADY_EXISTS:
                        case UserErrorCode.USER_NOT_FOUND:
                            throw AuthError.InvalidCredentials({ userId: args[0].id }, err);
                        case UserErrorCode.DATA_DELETE_FAILED:
                        case UserErrorCode.DATA_LOAD_FAILED:
                        case UserErrorCode.DATA_SAVE_FAILED:
                        case UserErrorCode.DATA_UPDATE_FAILED:
                        case UserErrorCode.RESOURCE_LOCKED:
                        case UserErrorCode.LOCK_OPERATION_FAILED:
                            throw AuthError.InternalError(err);
                        case UserErrorCode.UNKNOWN:
                            throw AuthError.Unknown(err);
                        default:
                            throw AuthError.Unknown(err);
                    }
                }
                throw err;
            }
        }
    }
}