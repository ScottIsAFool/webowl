import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getConfiguration } from '../config/configuration'
import { EmailModule } from '../email/email.module'
import { SocialModule } from '../social/social.module'
import { UserModule } from '../user/user.module'

import { AccessToken } from './access-token.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailVerification } from './email-verification.entity'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.stategy'
import { PasswordReset } from './password-reset.entity'

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([EmailVerification, PasswordReset, AccessToken]),
        PassportModule,
        JwtModule.register({
            secret: getConfiguration().jwtToken,
            signOptions: {
                expiresIn: `${getConfiguration().expiryTime}m`,
            },
        }),
        SocialModule,
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
