export enum StorageErrorCode {
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
    FILE_LOCKED = 'FILE_LOCKED', 
    STALE_LOCK = 'STALE_LOCK',            
    UNKNOWN = 'UNKNOWN',
  }
  
  export class StorageException extends Error {
    constructor(
      public readonly code: StorageErrorCode,
      message?: string,
    ) {
      super(message ?? code);
      this.name = 'StorageException';
    }
  }