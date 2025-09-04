import { AppError } from "../app-error";

export enum HostErrorCode {
    EXCEED_MAX_HOSTS = "EXCEED_MAX_HOSTS",
    INVALID_FORMAT = "INVALID_FORMAT",
    DUPLICATED_HOST = "DUPLICATED_HOST",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}


export class HostError extends AppError {

    static ExceedMaxHosts (details? : unknown, cause? : unknown ){
        return new HostError("RESOURCE", HostErrorCode.EXCEED_MAX_HOSTS, details, cause);
    }

    static InvalidFormat (details? : unknown, cause? : unknown){
        return new HostError("RESOURCE", HostErrorCode.INVALID_FORMAT, details, cause);
    }
    static DuplicatedHost (details? : unknown, cause? : unknown){
        return new HostError("RESOURCE", HostErrorCode.DUPLICATED_HOST, details, cause);
    }
    static InternalError (details? : unknown, cause? : unknown){
        return new HostError("RESOURCE", HostErrorCode.INTERNAL_ERROR, details, cause);
    }

}