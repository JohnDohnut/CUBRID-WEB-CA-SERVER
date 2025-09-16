import { HostError, LockError, StorageError } from "@root/src/error";


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

