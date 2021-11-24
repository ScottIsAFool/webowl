import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from '.'
import { EmailVerification, User } from '../entities'
import { EmailVerificationRepository, UserRepository } from '../repositories'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.stategy'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserRepository,
            EmailVerification,
            EmailVerificationRepository,
        ]),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
