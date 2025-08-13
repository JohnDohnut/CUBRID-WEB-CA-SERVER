import { HttpStatus } from '@nestjs/common';
import { ControllerErrorCode } from './controller-error-code';

// Fix ErrorStatusMap to match the declared type: 
// Record<ErrorCode, {message: string, status: HttpStatus}>

enum ControllerErrorMessage {
    TOKEN_EXPIRED = "Token has expired",
    INVALID_CREDENTIAL = "Invalid credential",
    INTERNAL_SERVER_ERROR = "Internal server error",
    FORBIDDEN = "Forbidden Request",
    UNAUTHORIZED = ""
}
export const ControllerErrorMap: Record<ControllerErrorCode, {message: string, status: HttpStatus}> = {
    [ControllerErrorCode.USER_ALREADY_EXISTS]: {
        message: ControllerErrorMessage.INVALID_CREDENTIAL,
        status: HttpStatus.UNAUTHORIZED
    },
    [ControllerErrorCode.TOKEN_EXPIRED]: {
        message: ControllerErrorMessage.TOKEN_EXPIRED,
        status: HttpStatus.UNAUTHORIZED
    },
    [ControllerErrorCode.INVALID_CREDENTIALS]: {
        message: ControllerErrorMessage.INVALID_CREDENTIAL,
        status: HttpStatus.UNAUTHORIZED
    },
    
    [ControllerErrorCode.INTERNAL_ERROR]: {
        message: ControllerErrorMessage.INTERNAL_SERVER_ERROR,
        status: HttpStatus.INTERNAL_SERVER_ERROR
    },
    [ControllerErrorCode.FORBIDDEN_REQUEST] : {
        message: ControllerErrorMessage.FORBIDDEN,
        status: HttpStatus.FORBIDDEN
    },
    [ControllerErrorCode.NO_SUCH_USER] : {
        message: ControllerErrorMessage.INVALID_CREDENTIAL,
        status: HttpStatus.UNAUTHORIZED
    }

};
