import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import type { User } from '@webowl/apiclient'
import { LocalAuthGuard } from '../guards'
import type { AuthRequest } from './types'

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req: AuthRequest): Promise<User> {
        return Promise.resolve(req.user.toDto())
    }
}
