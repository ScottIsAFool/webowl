import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '.'
import type { User } from '../entities'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'emailAddress' })
    }

    async validate(emailAddress: string, password: string): Promise<User> {
        const user = await this.authService.validateUser(emailAddress, password)
        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
