import { LockError } from '@error/lock/lock-error';

export function HandleLockFsErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        // This logic is from LockService's handleFsError
        switch (err?.code) {
            case 'ENOENT': 
                throw LockError.LockNotFound({ filePath: err.path }, err);
            case 'EACCES':
            case 'EPERM': 
                throw LockError.PermissionDenied({ filePath: err.path }, err);
            case 'EEXIST': 
            case 'ELOCKED': // proper-lockfile code
                throw LockError.LockAlreadyHeld({ filePath: err.file || err.path }, err);
            case 'ENOTACQUIRED': // proper-lockfile code
                throw LockError.LockNotFound({ filePath: err.file }, err);
            case 'ECOMPROMISED': // proper-lockfile code
                throw LockError.Unknown({ reason: 'Lock compromised', filePath: err.file }, err);
            case 'ERELEASED': // proper-lockfile code
                throw LockError.LockNotFound({ reason: 'Lock already released', filePath: err.file }, err);
            default: 
                throw LockError.Unknown({ originalCode: err?.code }, err);
        }
      }
    };
    return descriptor;
  };
}
