import { AppError } from '@error/app-error';
import { HostErrorCode } from '@error/host/host-error-code';

export { HostErrorCode };

export class HostError extends AppError {

    static ExceedMaxHosts(additionalData?: Record<string, any>, originalError?: Error) {
        return new HostError("RESOURCE", HostErrorCode.EXCEED_MAX_HOSTS, additionalData, originalError);
    }
    
    static InvalidFormat(additionalData?: Record<string, any>, originalError?: Error) {
        return new HostError("RESOURCE", HostErrorCode.INVALID_FORMAT, additionalData, originalError);
    }
    
    static DuplicatedHost(additionalData?: Record<string, any>, originalError?: Error) {
        return new HostError("RESOURCE", HostErrorCode.DUPLICATED_HOST, additionalData, originalError);
    }
    
    static NoSuchHost(additionalData?: Record<string, any>, originalError? : Error) {
        return new HostError("RESOURCE", HostErrorCode.NO_SUCH_HOST, additionalData, originalError);
    }

    static InternalError(additionalData?: Record<string, any>, originalError?: Error) {
        return new HostError("RESOURCE", HostErrorCode.INTERNAL_ERROR, additionalData, originalError);
    }

    

}