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

    // RFC 7807 Problem Details 생성
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
            // 추가 데이터를 Problem Details에 직접 포함
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
            case 'RESOURCE': return 400;
            case 'STORAGE': 
            case 'LOCK': 
            case 'USER':
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