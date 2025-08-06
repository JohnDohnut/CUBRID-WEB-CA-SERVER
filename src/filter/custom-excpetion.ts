import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';
import { ErrorMetaMap } from './error-meta-map.js';


export class CustomException extends HttpException {
    constructor(code: ErrorCode) {
        const meta = ErrorMetaMap[code] ?? {
            message: 'UNKNOWN ERROR',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        };

        super({ code, message: meta.message }, meta.status);
    }
}