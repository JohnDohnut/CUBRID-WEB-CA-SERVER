import { UserError, LockError, StorageError, StorageErrorCode } from "@root/src/error";


export function HandleUserErrors() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            }
            catch (err) {
                if (err instanceof LockError){
                    throw UserError.LockOperationFailed({}, err)
                }
                else if (err instanceof StorageError){
                    switch (err.code){
                        case StorageErrorCode.FILE_ALREADY_EXISTS:
                        case StorageErrorCode.PERMISSION_DENIED:
                        case StorageErrorCode.UNKNOWN:
                            throw UserError.Unknown();
                        case StorageErrorCode.FILE_NOT_FOUND:
                            UserError.UserNotFound(err.additionalData || {} , err);
                    }
                }
                else if (err instanceof UserError){
                    throw err;
                }
                else{

                    throw UserError.Unknown({}, err);
                }
            }
        }
    }
}
