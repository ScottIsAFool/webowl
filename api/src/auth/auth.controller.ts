import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    NotFoundException,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common'
import { AuthEndpoints, RegisterRequest, User, VerifyRequest } from '@webowl/apiclient'
import { validate } from 'class-validator'
import { EmailVerification, User as UserEntity } from '../entities'
import { LocalAuthGuard } from '../guards'
import { EmailVerificationRepository, UserRepository } from '../repositories'
import { isValidPassword } from './auth.utils'
import type { AuthRequest } from './types'

@Controller('auth/')
export class AuthController {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly verificationRepo: EmailVerificationRepository,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post(AuthEndpoints.login)
    login(@Request() req: AuthRequest): Promise<User> {
        return Promise.resolve(req.user.toDto())
    }

    @Post(AuthEndpoints.register)
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

    @Post(AuthEndpoints.verify)
    async verifyEmail(@Body() request: VerifyRequest): Promise<void> {
        const { emailAddress, verificationCode } = request
        if (!emailAddress || !verificationCode) {
            throw new BadRequestException('Email address and code required')
        }

        const emailVerification = await this.verificationRepo.get(emailAddress)
        if (!emailVerification) {
            throw new BadRequestException('No verification code for this email address')
        }

        if (emailVerification.verificationCode !== verificationCode) {
            throw new ForbiddenException('Verification code does not match')
        }

        const user = await this.userRepo.getUser({ type: 'email', emailAddress })
        if (!user) {
            throw new NotFoundException('User not found for this email address')
        }

        user.isVerified = true
        await this.userRepo.save(user)
        await this.verificationRepo.remove(emailVerification)
    }
}
