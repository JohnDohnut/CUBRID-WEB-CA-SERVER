import {ErrorKind, AppError} from "../app-error";

export enum StorageErrorCode {
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
    UNKNOWN = 'UNKNOWN',
}


export class StorageError extends AppError {

    constructor(kind : ErrorKind, code : string, details, cause) {
        super(kind, code, details, cause);
    }

    static NotFound(details?: unknown, cause?: unknown) {
        return new StorageError("STORAGE", StorageErrorCode.FILE_NOT_FOUND, details, cause);
    }
    static PermissionDenied(details?: unknown, cause?: unknown) {
        return new StorageError("STORAGE", StorageErrorCode.PERMISSION_DENIED, details, cause);
    }

    static AlreadyExists(details?: unknown, cause?: unknown) {
        return new StorageError("STORAGE", StorageErrorCode.FILE_ALREADY_EXISTS, details, cause);
    }



    static Unknown(details?: unknown, cause?: unknown) {
        return new StorageError("STORAGE", StorageErrorCode.UNKNOWN, details, cause);
    }

}