import { AuthErrorCode } from '@error/auth/auth-error-code';
import { StorageErrorCode } from '@error/storage/storage-error-code';
import { LockErrorCode } from '@error/lock/lock-error-code';
import { HostErrorCode } from '@error/host/host-error-code';
import { UserErrorCode } from '@error/user/user-error-code';

export type ErrorKind = 'AUTH' | 'STORAGE' | 'LOCK' | 'RESOURCE' | 'USER' | 'INTERNAL';

export class AppError extends Error {

    constructor(
        public readonly kind: ErrorKind,
        public readonly code: string,
        public readonly additionalData?: Record<string, any>,
        public readonly originalError?: Error
    ) { 
        super(code);
        this.name = new.target.name;
    }

    // RFC 7807 Problem Details generation (for client response - excluding internal information)
    toProblemDetails(requestUrl?: string) {
        return {
            type: `/errors/${this.kind.toLowerCase()}/${this.code.toLowerCase()}`,
            title: this.code.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' '),
            status: this.getHttpStatus(),
            detail: this.message,
            instance: requestUrl || '',
            code: this.code,
            timestamp: new Date().toISOString(),
            // Include additional data directly in Problem Details (excluding sensitive information)
            ...(this.additionalData || {})
        };
    }

    // Detailed information for logging (including internal system information)
    toLogDetails(requestUrl?: string) {
        return {
            type: `/errors/${this.kind.toLowerCase()}/${this.code.toLowerCase()}`,
            title: this.code.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' '),
            status: this.getHttpStatus(),
            detail: this.message,
            instance: requestUrl || '',
            kind: this.kind,
            code: this.code,
            timestamp: new Date().toISOString(),
            // Include all additional data
            ...(this.additionalData || {}),
            // Original error information (for debugging)
            ...(this.originalError ? { 
                originalError: {
                    name: this.originalError.name,
                    message: this.originalError.message,
                    stack: this.originalError.stack
                }
            } : {})
        };
    }

    private getHttpStatus(): number {
        switch (this.kind) {
            case 'AUTH': 
                switch(this.code) {
                    case AuthErrorCode.INVALID_CREDENTIALS:
                    case AuthErrorCode.INVALID_TOKEN:
                        return 401;
                    case AuthErrorCode.PERMISSION_DENIED:
                        return 403;
                    case AuthErrorCode.INTERNAL_ERROR:
                        return 500;
                    case AuthErrorCode.UNKNOWN:
                        return 500;
                    default:
                        return 401;
                }
            case 'RESOURCE': 
                // Subdivide RESOURCE errors
                switch (this.code) {
                    case HostErrorCode.EXCEED_MAX_HOSTS:
                    case HostErrorCode.INVALID_FORMAT:
                        return 400; 
                    case HostErrorCode.DUPLICATED_HOST:
                        return 409; // Conflict - resource collision
                    case HostErrorCode.INTERNAL_ERROR:
                        return 500; // Internal Server Error
                    default:
                        return 400;
                }
            case 'USER': 
                switch (this.code) {
                    case UserErrorCode.USER_NOT_FOUND:
                    case UserErrorCode.USER_ALREADY_EXISTS:
                        return 409; // Authentication/authorization related
                    case UserErrorCode.DATA_SAVE_FAILED:
                    case UserErrorCode.DATA_LOAD_FAILED:
                    case UserErrorCode.DATA_DELETE_FAILED:
                    case UserErrorCode.DATA_UPDATE_FAILED:
                        return 500; // Internal server error
                    case UserErrorCode.RESOURCE_LOCKED:
                        return 423; // Locked - resource is locked
                    case UserErrorCode.LOCK_OPERATION_FAILED:
                        return 500; // Internal server error
                    case UserErrorCode.OLD_PASSWORD_MISMATCH:
                    case UserErrorCode.BAD_NEW_PASSWORD:
                        return 400; // Bad request
                    case UserErrorCode.UNKNOWN:
                        return 500; // Internal server error
                    
                    default:
                        return 500;
                }
            case 'STORAGE': 
                switch(this.code) {
                    case StorageErrorCode.FILE_NOT_FOUND:
                    case StorageErrorCode.FILE_ALREADY_EXISTS:
                        return 400;
                    case StorageErrorCode.PERMISSION_DENIED:
                        return 403;
                    case StorageErrorCode.UNKNOWN:
                        return 500;
                    default:
                        return 500;
                }
            case 'LOCK': 
                switch(this.code) {
                    case LockErrorCode.LOCK_NOT_FOUND:
                        return 404; // Not Found
                    case LockErrorCode.PERMISSION_DENIED:
                        return 403;
                    case LockErrorCode.LOCK_ALREADY_HELD:
                        return 409;
                    case LockErrorCode.STALE_LOCK:
                        return 410; // Gone - expired lock
                    case LockErrorCode.UNKNOWN:
                        return 500;
                    default:
                        return 500;
                }
            case 'INTERNAL': return 500;
            default: return 500;
        }
    }

}
