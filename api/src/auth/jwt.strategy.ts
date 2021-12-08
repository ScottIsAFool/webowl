import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { getConfiguration } from '../config/configuration'
import { UserService } from '../user/user.service'

import type { User } from '../user/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
            secretOrKey: getConfiguration().jwtToken,
        })
    }

    async validate({
        emailAddress,
        sub,
        isRefresh,
    }: {
        emailAddress: string
        sub: number
        isRefresh?: boolean
    }): Promise<User> {
        const user = await this.userService.getByEmail(emailAddress)

        if (!user || user.id !== sub || isRefresh) {
            throw new UnauthorizedException()
        }

        return user
    }
}
