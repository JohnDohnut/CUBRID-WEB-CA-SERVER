import { AppError } from "../app-error";

export enum HostErrorCode {
    EXCEED_MAX_HOSTS = "EXCEED_MAX_HOSTS",
    INVALID_FORMAT = "INVALID_FORMAT",
    DUPLICATED_HOST = "DUPLICATED_HOST",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}

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
    
    static InternalError(additionalData?: Record<string, any>, originalError?: Error) {
        return new HostError("RESOURCE", HostErrorCode.INTERNAL_ERROR, additionalData, originalError);
    }

}