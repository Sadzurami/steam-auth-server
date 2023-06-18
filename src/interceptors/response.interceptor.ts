import { map, Observable } from 'rxjs';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = { status: 'success' } as any;
        if (data) response.data = data;
        return response;
      }),
    );
  }
}
