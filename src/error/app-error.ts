export type ErrorKind = 'AUTH' | 'STORAGE' | 'LOCK' | 'RESOURCE' | 'USER' | 'INTERNAL';

export class AppError extends Error {

    constructor(
        public readonly kind: ErrorKind,
        public readonly code: string,
        public readonly additionalData?: Record<string, any>,
        public readonly originalError?: Error
    ) { 
        super(code);
        this.name = new.target.name;
    }

    // RFC 7807 Problem Details 생성 (클라이언트 응답용 - 내부 정보 제외)
    toProblemDetails(requestUrl?: string) {
        return {
            type: `/errors/${this.kind.toLowerCase()}/${this.code.toLowerCase()}`,
            title: this.code.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' '),
            status: this.getHttpStatus(),
            detail: this.message,
            instance: requestUrl || '',
            kind: this.kind,
            code: this.code,
            timestamp: new Date().toISOString(),
            // 추가 데이터를 Problem Details에 직접 포함 (민감한 정보 제외)
            ...(this.additionalData || {})
        };
    }

    // 로깅용 상세 정보 (내부 시스템 정보 포함)
    toLogDetails(requestUrl?: string) {
        return {
            type: `/errors/${this.kind.toLowerCase()}/${this.code.toLowerCase()}`,
            title: this.code.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' '),
            status: this.getHttpStatus(),
            detail: this.message,
            instance: requestUrl || '',
            kind: this.kind,
            code: this.code,
            timestamp: new Date().toISOString(),
            // 모든 추가 데이터 포함
            ...(this.additionalData || {}),
            // 원본 에러 정보 (디버깅용)
            ...(this.originalError ? { 
                originalError: {
                    name: this.originalError.name,
                    message: this.originalError.message,
                    stack: this.originalError.stack
                }
            } : {})
        };
    }

    private getHttpStatus(): number {
        switch (this.kind) {
            case 'AUTH': return 401;
            case 'RESOURCE': 
                // RESOURCE 에러를 세분화
                switch (this.code) {
                    case 'EXCEED_MAX_HOSTS':
                    case 'INVALID_FORMAT':
                        return 400; 
                    case 'DUPLICATED_HOST':
                        return 409; // Conflict - 리소스 충돌
                    case 'INTERNAL_ERROR':
                        return 500; // Internal Server Error
                    default:
                        return 400;
                }
            case 'USER': 
                switch (this.code) {
                    case 'USER_NOT_FOUND':
                    case 'USER_ALREADY_EXISTS':
                        return 409; // 인증/인가 관련
                    case 'DATA_SAVE_FAILED':
                    case 'DATA_LOAD_FAILED':
                    case 'DATA_DELETE_FAILED':
                    case 'DATA_UPDATE_FAILED':
                        return 500; // 서버 내부 에러
                    default:
                        return 500;
                }
            case 'STORAGE': 
                switch(this.code) {
                    case 'FILE_NOT_FOUND':
                    case 'FILE_ALREADY_EXISTS':
                        return 400;
                    case 'PERMISSION_DENIED':
                        return 403;
                }
            case 'LOCK': 
                switch(this.code) {
                    case 'PERMISSION_DENIED':
                        return 403;
                    case 'LOCK_ALREADY_HELD':
                        return 409;
                }
            case 'INTERNAL': return 500;
            default: return 500;
        }
    }

}


/**
 * code structure 
 * 
 * enum DomainErrorCode = [DETAIL_ERROR_CODE_1 : "DETAIL_ERROR_CODE_1", ...]
 * 
 * export class DomainError extends AppError {
 *      static DetailedError (){
 *          return super(DETAIL_ERROR_CODE_1, 'DOMAIN', ...)
 *      }
 *      
 *      ...
 *  
 * ]
 * 
 * 
 */