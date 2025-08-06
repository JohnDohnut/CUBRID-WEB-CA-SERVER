import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

// Fix ErrorStatusMap to match the declared type: 
// Record<ErrorCode, {message: string, status: HttpStatus}>
export const ErrorMetaMap: Record<ErrorCode, {message: string, status: HttpStatus}> = {
    [ErrorCode.USER_ALREADY_EXISTS]: {
        message: "User already exists",
        status: HttpStatus.CONFLICT
    },
    [ErrorCode.EXPIRED_TOKEN]: {
        message: "Token has expired",
        status: HttpStatus.UNAUTHORIZED
    },
    [ErrorCode.INVALID_CREDENTIALS]: {
        message: "Invalid credentials",
        status: HttpStatus.UNAUTHORIZED
    },
    [ErrorCode.FILE_NOT_FOUND]: {
        message: "File not found",
        status: HttpStatus.NOT_FOUND
    },
    [ErrorCode.INTERNAL_ERROR]: {
        message: "Internal server error",
        status: HttpStatus.INTERNAL_SERVER_ERROR
    },
};
