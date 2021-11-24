import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as Sentry from '@sentry/minimal'

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
