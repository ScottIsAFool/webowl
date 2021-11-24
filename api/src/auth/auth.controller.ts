import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common'
import type { RegisterRequest, User } from '@webowl/apiclient'
import { validate } from 'class-validator'
import { EmailVerification, User as UserEntity } from '../entities'
import { LocalAuthGuard } from '../guards'
import { EmailVerificationRepository, UserRepository } from '../repositories'
import { isValidPassword } from './auth.utils'
import type { AuthRequest } from './types'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly verificationRepo: EmailVerificationRepository,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req: AuthRequest): Promise<User> {
        return Promise.resolve(req.user.toDto())
    }

    @Post('/register')
    async register(@Body() request: RegisterRequest): Promise<void> {
        const user = UserEntity.create(request)

        const existingUser = await this.userRepo.getUser({
            type: 'email',
            emailAddress: user.emailAddress,
        })
        if (existingUser) {
            throw new ConflictException('Account already exists with that email address')
        }

        // Validate the parameters are ok
        const errors = await validate(user)
        if (errors.length > 0) {
            throw new BadRequestException(errors)
        }

        if (!isValidPassword(user.password)) {
            throw new BadRequestException('Password not strong enough')
        }

        // Hash the password to securely store in DB
        user.hashPassword()

        try {
            await this.userRepo.save(user)
            const verification = EmailVerification.create(user.emailAddress, user.id)
            await this.verificationRepo.save(verification)

            // send email out
        } catch (e: unknown) {
            throw new BadRequestException(e)
        }
    }
}
