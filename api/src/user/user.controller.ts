import { Controller, Get, UseGuards } from '@nestjs/common'

import { AuthUser } from '../auth/auth-user.decorator'
import { JwtGuard } from '../auth/jwt.guard'

import type { UserResponse } from '@webowl/apiclient'
import type { User } from './user.entity'

@Controller('user')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('/')
    getAuthenticatedUser(@AuthUser() user: User): Promise<UserResponse> {
        return Promise.resolve({
            user: user.toDto(),
        })
    }
}
