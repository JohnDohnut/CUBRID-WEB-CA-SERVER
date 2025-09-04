import { AppError } from "../app-error";

export enum RepositoryErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
}


export class RepositoryError extends AppError {
    static UserNotFound (details? : unknown, cause? : unknown){
        return new super("RESOURCE", RepositoryErrorCode.USER_NOT_FOUND, details, cause);
    }

    static UserAlreadyExists (details? : unknown, cause? : unknown){
        return new super("RESOURCE", RepositoryErrorCode.USER_ALREADY_EXISTS, details, cause);
    }
}