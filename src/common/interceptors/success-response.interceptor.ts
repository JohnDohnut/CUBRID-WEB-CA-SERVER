import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor that wraps successful responses with a `result: true` property.
 * 성공적인 응답을 `result: true` 속성으로 래핑하는 인터셉터입니다.
 *
 * This ensures a consistent API response structure where clients can easily
 * check the success status of an operation.
 *
 * 이를 통해 클라이언트는 작업의 성공 상태를 쉽게 확인할 수 있는
 * 일관된 API 응답 구조를 보장합니다.
 *
 * @category Interceptors
 * @since 1.0.0
 */
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object' && data !== null) {
          return { result: true, ...data }; // Merge result with data
        } else {
          return { result: true, data: data }; // Fallback for non-object data
        }
      }),
    );
  }
}
