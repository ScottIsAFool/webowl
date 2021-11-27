import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import type { AuthToken } from '@webowl/apiclient'
import type { Repository } from 'typeorm'
import { getConfiguration } from '../config/configuration'
import type { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { AccessToken } from './access-token.entity'
import { EmailVerification } from './email-verification.entity'
import { PasswordReset } from './password-reset.entity'

type JwtOptions = {
    emailAddress: string
    sub: number
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(EmailVerification)
        private readonly verifyRepo: Repository<EmailVerification>,
        @InjectRepository(PasswordReset)
        private readonly passwordRepo: Repository<PasswordReset>,
        @InjectRepository(AccessToken)
        private readonly accessTokenRepo: Repository<AccessToken>,
        private readonly jwtService: JwtService,
    ) {}

    private readonly logger = new Logger(AuthService.name)

    async getUserFromToken(accessToken: string): Promise<User | undefined> {
        const result = this.jwtService.decode(accessToken) as JwtOptions | undefined
        if (result?.emailAddress) {
            const user = await this.userService.getByEmail(result.emailAddress)
            return user
        }
        return undefined
    }

    async generateAccessToken(options: JwtOptions): Promise<AuthToken> {
        const accessToken = await this.jwtService.signAsync(options)
        const refreshToken = await this.jwtService.signAsync(options, {
            secret: getConfiguration().jwtToken,
            expiresIn: '9999 years',
        })

        const token = AccessToken.create({ accessToken, userId: options.sub, refreshToken })

        await this.accessTokenRepo.save(token)

        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresAt: token.expiresAt,
        }
    }

    async getAccessTokenByRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<AccessToken | undefined> {
        const tokens = await this.accessTokenRepo.find({
            where: {
                userId,
            },
        })

        return tokens.find((x) => x.refreshToken === refreshToken)
    }

    async deleteAccessToken(accessToken: AccessToken): Promise<void> {
        await this.accessTokenRepo.remove(accessToken)
    }

    async deleteUserAccessToken(userId: number, accessToken: string): Promise<void> {
        const tokens = await this.accessTokenRepo.find({
            where: { userId },
        })
        const token = tokens.find((x) => x.accessToken === accessToken)
        if (token) {
            await this.accessTokenRepo.remove(token)
        }
    }

    async validateUser(emailAddress: string, password: string): Promise<User | undefined> {
        const user = await this.userService.getByEmail(emailAddress)
        if (user?.checkIfPasswordIsValid(password)) {
            return user
        }

        return undefined
    }

    getEmailVerification(emailAddress: string): Promise<EmailVerification | undefined> {
        return this.verifyRepo.findOne({ where: { emailAddress } })
    }

    saveEmailVerification(verification: EmailVerification): Promise<EmailVerification> {
        return this.verifyRepo.save(verification)
    }

    async deleteEmailVerification(verification: EmailVerification): Promise<void> {
        await this.verifyRepo.remove(verification)
    }

    getPasswordReset(emailAddress: string): Promise<PasswordReset | undefined> {
        return this.passwordRepo.findOne({ where: { emailAddress } })
    }

    async deletePasswordReset(passwordReset: PasswordReset): Promise<void> {
        await this.passwordRepo.remove(passwordReset)
    }
}
