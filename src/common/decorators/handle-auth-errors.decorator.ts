import { UserError, UserErrorCode } from "@root/src/error";
import { AuthError } from "@root/src/error/auth/auth-error";

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
                            throw AuthError.InvalidCredentials({ userId: args[0] }, err);
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