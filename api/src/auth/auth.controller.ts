import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    NotFoundException,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common'
import type {
    LoginResponse,
    SendPasswordResetRequest,
    RegisterRequest,
    VerifyRequest,
    PasswordResetRequest,
    ChangePasswordRequest,
    ResendVerificationRequest,
} from '@webowl/apiclient'
import { validate } from 'class-validator'
import { User as UserEntity, UserService } from '../user'
import { LocalAuthGuard } from '../guards'
import { endpoint } from '../utils/endpoint-utils'
import { isValidPassword } from './auth.utils'
import { EmailVerification } from './email-verification.entity'
import { PasswordReset } from './password-reset.entity'
import type { AuthRequest } from './types'
import { AuthService } from '.'

@Controller('auth/')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post(endpoint('login'))
    login(@Request() req: AuthRequest): Promise<LoginResponse> {
        return Promise.resolve({
            user: req.user.toDto(),
        })
    }

    @Post(endpoint('register'))
    async register(@Body() request: RegisterRequest): Promise<void> {
        const user = UserEntity.create(request)

        const existingUser = await this.userService.getByEmail(user.emailAddress)
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
            await this.userService.save(user)
            const verification = EmailVerification.create(user.emailAddress, user.id)
            await this.authService.saveEmailVerification(verification)

            // send email out
        } catch (e: unknown) {
            throw new BadRequestException(e)
        }
    }

    @Post(endpoint('verify-email'))
    async verifyEmail(@Body() request: VerifyRequest): Promise<void> {
        const { emailAddress, verificationCode } = request
        if (!emailAddress || !verificationCode) {
            throw new BadRequestException('Email address and code required')
        }

        const emailVerification = await this.authService.getEmailVerification(emailAddress)
        if (!emailVerification) {
            throw new BadRequestException('No verification code for this email address')
        }

        if (emailVerification.verificationCode !== verificationCode) {
            throw new ForbiddenException('Verification code does not match')
        }

        const user = await this.userService.getByEmail(emailAddress)
        if (!user) {
            throw new NotFoundException('User not found for this email address')
        }

        user.isVerified = true
        await this.userService.save(user)
        await this.authService.deleteEmailVerification(emailVerification)
    }

    @Post(endpoint('send-password-reset'))
    async sendPasswordReset(@Body() request: SendPasswordResetRequest): Promise<void> {
        const { emailAddress } = request
        if (!emailAddress?.trim()) {
            throw new BadRequestException('Email address is required')
        }

        const user = await this.userService.getByEmail(emailAddress)
        if (user) {
            let passwordReset = await this.authService.getPasswordReset(emailAddress)
            if (!passwordReset) {
                passwordReset = PasswordReset.create(emailAddress)
            }

            // Send email
        }
    }

    @Post(endpoint('password-reset'))
    async passwordReset(@Body() request: PasswordResetRequest): Promise<void> {
        const { emailAddress, code, password } = request
        if (!emailAddress?.trim() || !code?.trim()) {
            throw new BadRequestException('Email address and code required')
        }

        const resetPassword = await this.authService.getPasswordReset(emailAddress)
        if (!resetPassword) {
            throw new NotFoundException('No password request found')
        }

        if (code !== resetPassword.resetCode) {
            throw new BadRequestException('Codes do not match')
        }

        if (!isValidPassword(password)) {
            throw new BadRequestException('Password not strong enough')
        }

        const user = await this.userService.getByEmail(emailAddress)
        if (!user) {
            throw new NotFoundException('User not found')
        }

        user.password = password
        user.hashPassword()

        await this.userService.save(user)
        await this.authService.deletePasswordReset(resetPassword)
    }

    // @UseGuards(JwtGuard)
    @Post(endpoint('change-password'))
    async changePassword(
        @Request() req: AuthRequest,
        @Body() request: ChangePasswordRequest,
    ): Promise<void> {
        const { user } = req
        const { oldPassword, newPassword } = request

        if (!oldPassword?.trim() || !newPassword?.trim()) {
            throw new BadRequestException('Old and new passwords must be provided')
        }

        if (!user.checkIfPasswordIsValid(oldPassword)) {
            throw new UnauthorizedException('Old password does not match')
        }

        if (!isValidPassword(newPassword)) {
            throw new BadRequestException('New password not strong enough')
        }

        user.password = newPassword
        user.hashPassword()
        await this.userService.save(user)
    }

    @Post(endpoint('resend-verification'))
    async resendVerification(@Body() request: ResendVerificationRequest): Promise<void> {
        const { emailAddress } = request

        const code = await this.authService.getEmailVerification(emailAddress)
        if (!code) {
            return
        }

        const user = await this.userService.getByEmail(emailAddress)
        if (!user) {
            return
        }

        // Send email
    }
}
