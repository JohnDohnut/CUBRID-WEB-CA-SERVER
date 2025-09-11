import { StorageError } from '@error/storage/storage-error';
import { AppError } from '@root/src/error';

export function HandleStorageFsErrors() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        if(err instanceof AppError){
          throw err;
        }
        switch (err?.code) {
          case 'ENOENT': 
            throw StorageError.NotFound({ filePath: err.path }, err);
          case 'EEXIST': 
            throw StorageError.AlreadyExists({ filePath: err.path }, err);
          case 'EACCES':
          case 'EPERM':  
            throw StorageError.PermissionDenied({ filePath: err.path }, err);
          default:       
            throw StorageError.Unknown({ originalCode: err?.code, originalMessage: err?.message }, err);
        }
      }
    };
    return descriptor;
  };
}
