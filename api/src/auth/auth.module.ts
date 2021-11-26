import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailVerification } from './email-verification.entity'
import { LocalStrategy } from './local.stategy'
import { PasswordReset } from './password-reset.entity'

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([EmailVerification, PasswordReset]),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService],
})
export class AuthModule {}
