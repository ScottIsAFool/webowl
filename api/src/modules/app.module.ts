import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConfiguration } from '../config/configuration'
import { AppController, PingController } from '../controllers'
import { SentryInterceptor } from '../interceptors'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRoot({
            ...getConfiguration().database,
            type: 'postgres',
            entities: [],
            synchronize: false,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            cli: {
                migrationsDir: 'src/migrations',
            },
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
