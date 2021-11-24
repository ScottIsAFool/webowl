import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController, PingController } from '../controllers'
import { SentryInterceptor } from '../interceptors'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
    ],
    controllers: [AppController, PingController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SentryInterceptor,
        },
    ],
})
export class AppModule {}
