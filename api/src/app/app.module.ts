import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConfiguration } from '../config/configuration'
import { PingModule } from '../ping'
import { SentryInterceptor } from '../interceptors'
import { AppController } from './app.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRoot({
            ...getConfiguration().database,
            type: 'postgres',
            // entities: [User, PasswordReset, EmailVerification],
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: false,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            cli: {
                migrationsDir: 'src/migrations',
            },
        }),
        AuthModule,
        PingModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: SentryInterceptor,
        },
    ],
})
export class AppModule {}
