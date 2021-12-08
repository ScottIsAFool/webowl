import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { getConfiguration } from '../config/configuration'
import { SentryInterceptor } from '../interceptors'
import { LeagueModule } from '../league/league.module'
import { PingModule } from '../ping'
import { SeasonModule } from '../season/season.module'

import { AppController } from './app.controller'

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
        LeagueModule,
        SeasonModule,
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
