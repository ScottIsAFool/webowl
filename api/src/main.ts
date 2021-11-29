import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { getConfiguration } from './config/configuration'
import * as Sentry from '@sentry/node'
import { isProduction } from './utils/env-utils'
import { polyfillFetch } from './utils/polyfills'

polyfillFetch()

async function bootstrap() {
    const { port, corsRestrictions, sentryDSN } = getConfiguration()
    const app = await NestFactory.create(AppModule)

    if (isProduction() && sentryDSN) {
        Sentry.init({ dsn: sentryDSN })
    }

    app.enableCors({
        origin: corsRestrictions,
        methods: ['POST', 'GET', 'DELETE', 'OPTIONS'],
    })

    await app.listen(port)
}
bootstrap().finally(() => {
    // noop
})
