import { AppError } from "../app-error";

export enum CmsErrorCode {
    REQUEST_FAILED = 'REQUEST_FAILED',
    NO_RESPONSE = 'NO_RESPONSE',
    UNKNOWN = 'UNKNOWN',
}

export class CmsError extends AppError {


    static RequestFailed(additionalData?: Record<string, any>, originalError?: Error) {
        return new CmsError("CMS", CmsErrorCode.REQUEST_FAILED, additionalData, originalError);
    }

    static NoResponse(additionalData?: Record<string, any>, originalError?: Error) {
        return new CmsError("CMS", CmsErrorCode.NO_RESPONSE, additionalData, originalError);
    }

    static Unknown(additionalData?: Record<string, any>, originalError?: Error) {
        return new CmsError("CMS", CmsErrorCode.UNKNOWN, additionalData, originalError);
    }

}