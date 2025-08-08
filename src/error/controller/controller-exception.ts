import { HttpException, HttpStatus } from '@nestjs/common';
import { ControllerErrorCode } from './controller-error-code';
import { ControllerErrorMap } from './controller-error-meta-map';


export class ControllerException extends HttpException {
    constructor(code: ControllerErrorCode) {
        const meta = ControllerErrorMap[code] ?? {
            message: 'UNKNOWN ERROR',
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        };

        super({ code, message: meta.message }, meta.status);
    }
}