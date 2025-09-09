import { UserError } from '@error/user/user-error';
import { LockError, LockErrorCode } from '@error/lock/lock-error';
import { StorageError, StorageErrorCode } from '@error/storage/storage-error';

/**
 * A method decorator that wraps a repository method in a try...catch block.
 * It provides centralized handling for LockError and StorageError, translating
 * them into the appropriate domain-specific UserError.
 *
 * @assumption This decorator assumes that the first argument of the decorated
 * method is a string (e.g., userId) that can be used for logging context.
 */
export function HandleUserRepoErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        const contextId = args[0] || 'unknown';

        if (err instanceof LockError) {
          if (err.code === LockErrorCode.LOCK_ALREADY_HELD) {
            throw UserError.ResourceLocked({ resourceId: contextId }, err);
          } else {
            throw UserError.LockOperationFailed({ resourceId: contextId, reason: err.code }, err);
          }
        }

        if (err instanceof StorageError) {
          switch (err.code) {
            case StorageErrorCode.FILE_NOT_FOUND:
              throw UserError.UserNotFound({ userId: contextId }, err);
            case StorageErrorCode.FILE_ALREADY_EXISTS:
              throw UserError.UserAlreadyExists({ userId: contextId }, err);
            default:
              throw UserError.Unknown({ resourceId: contextId, storageError: err.code }, err);
          }
        }

        // If it's an unrecognized error, re-throw it to be handled elsewhere.
        throw err;
      }
    };

    return descriptor;
  };
}
