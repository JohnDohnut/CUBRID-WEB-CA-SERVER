export enum LockErrorCode {
    LOCK_NOT_FOUND = 'LOCK_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    LOCK_ALREADY_HELD = 'LOCK_ALREADY_HELD',
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    STALE_LOCK = 'STALE_LOCK',            
    UNKNOWN = 'UNKNOWN',
  }
  
  export class LockException extends Error {
    constructor(
      public readonly code: LockErrorCode,
      message?: string,
    ) {
      super(message ?? code);
      this.name = 'LockException';
    }
  }