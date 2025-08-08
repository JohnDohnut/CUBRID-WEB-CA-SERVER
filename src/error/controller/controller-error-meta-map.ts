import { HttpStatus } from '@nestjs/common';
import { ControllerErrorCode } from './controller-error-code';

// Fix ErrorStatusMap to match the declared type: 
// Record<ErrorCode, {message: string, status: HttpStatus}>
export const ControllerErrorMap: Record<ControllerErrorCode, {message: string, status: HttpStatus}> = {
    [ControllerErrorCode.USER_ALREADY_EXISTS]: {
        message: "User already exists",
        status: HttpStatus.CONFLICT
    },
    [ControllerErrorCode.EXPIRED_TOKEN]: {
        message: "Token has expired",
        status: HttpStatus.UNAUTHORIZED
    },
    [ControllerErrorCode.INVALID_CREDENTIALS]: {
        message: "Invalid credentials",
        status: HttpStatus.UNAUTHORIZED
    },
    
    [ControllerErrorCode.INTERNAL_ERROR]: {
        message: "Internal server error",
        status: HttpStatus.INTERNAL_SERVER_ERROR
    },
    [ControllerErrorCode.FORBIDDEN_REQUEST] : {
        message: "Forbidden Request",
        status: HttpStatus.FORBIDDEN
    }

};
