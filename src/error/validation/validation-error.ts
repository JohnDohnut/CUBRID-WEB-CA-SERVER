import { AppError } from '@error/app-error';
import { ValidationErrorCode } from './validation-error-code';

/**
 * Error class for validation-related operations.
 * Used for request body validation, form validation, etc.
 * 
 * 유효성 검사 관련 작업을 위한 에러 클래스입니다.
 * 요청 본문 검증, 폼 검증 등에 사용됩니다.
 */
export class ValidationError extends AppError {
    /**
     * Creates a validation error for invalid request body.
     * 
     * @param missingFields - Array of missing required field names
     * @param additionalData - Additional error context
     * @returns ValidationError instance
     */
    static InvalidRequestBody(
        missingFields?: string[],
        additionalData?: Record<string, any>,
    ) {
        return new ValidationError(
            'VALIDATION',
            ValidationErrorCode.INVALID_REQUEST_BODY,
            {
                missingFields,
                ...additionalData,
            },
        );
    }

    /**
     * Creates a validation error for missing required field(s).
     * 
     * @param fieldNames - Array of missing field names
     * @param additionalData - Additional error context
     * @returns ValidationError instance
     */
    static MissingRequiredField(
        fieldNames: string | string[],
        additionalData?: Record<string, any>,
    ) {
        const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
        return new ValidationError(
            'VALIDATION',
            ValidationErrorCode.MISSING_REQUIRED_FIELD,
            {
                missingFields: fields,
                ...additionalData,
            },
        );
    }

    /**
     * Creates a validation error for invalid field format.
     * 
     * @param fieldName - Field name with invalid format
     * @param expectedFormat - Expected format description
     * @param additionalData - Additional error context
     * @returns ValidationError instance
     */
    static InvalidFieldFormat(
        fieldName: string,
        expectedFormat?: string,
        additionalData?: Record<string, any>,
    ) {
        return new ValidationError(
            'VALIDATION',
            ValidationErrorCode.INVALID_FIELD_FORMAT,
            {
                fieldName,
                expectedFormat,
                ...additionalData,
            },
        );
    }
}

