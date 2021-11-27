import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailVerification } from './email-verification.entity'
import { LocalStrategy } from './local.stategy'
import { PasswordReset } from './password-reset.entity'
import { getConfiguration } from '../config/configuration'
import { JwtStrategy } from './jwt.strategy'
import { AccessToken } from './access-token.entity'
import { SocialModule } from '../social/social.module'

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
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
