export type ErrorKind = 'AUTH' 
| 'STORAGE' // file operation errors 
| 'LOCK'  // lock operation errors
| 'RESOURCE'  // resource policy (max length of host list, monitoring list, etc.)
| 'STORAGE' // File IO Errors 
| 'INTERNAL'; // unhandled server error, which must be monitored by operator

export class AppError extends Error {

    constructor(
        public readonly kind : ErrorKind,
        public readonly code: string,
        public readonly details? : unknown,
        public readonly cause? : unknown,

    ) { 
        super(code);
        this.name = new.target.name;

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