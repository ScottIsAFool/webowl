import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from '.'
import { EmailVerification, PasswordReset, User } from '../entities'
import {
    EmailVerificationRepository,
    PasswordResetRepository,
    UserRepository,
} from '../repositories'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './local.stategy'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserRepository,
            EmailVerification,
            EmailVerificationRepository,
            PasswordReset,
            PasswordResetRepository,
        ]),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
