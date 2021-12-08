import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import * as Sentry from '@sentry/minimal'
import { tap } from 'rxjs/operators'

import type { Observable } from 'rxjs'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            tap(null, (exception) => {
                Sentry.captureException(exception)
            }),
        )
    }
}
