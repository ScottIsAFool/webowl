import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Headers,
    HttpCode,
    HttpStatus,
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
    RefreshTokenRequest,
    AuthToken,
    SocialAuthRequest,
    CheckEmailRequest,
    CheckEmailResponse,
} from '@webowl/apiclient'
import { validate } from 'class-validator'
import { User, User as UserEntity, UserService } from '../user'
import { endpoint } from '../utils/endpoint-utils'
import { isValidPassword } from './auth.utils'
import { EmailVerification } from './email-verification.entity'
import { PasswordReset } from './password-reset.entity'
import type { AuthRequest } from './types'
import { AuthService } from '.'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtGuard } from './jwt.guard'
import { AuthUser } from './auth-user.decorator'
import { SocialAuthProvider } from '../social/social-provider.service'
import type { SocialUser } from '../social/types'

@Controller('auth/')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly socialAuthProvider: SocialAuthProvider,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post(endpoint('check-email'))
    async checkEmail(@Body() request: CheckEmailRequest): Promise<CheckEmailResponse> {
        const { emailAddress } = request
        const user = await this.userService.getByEmail(emailAddress)
        return {
            exists: Boolean(user),
            verified: Boolean(user?.isVerified),
        }
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post(endpoint('login'))
    async login(@AuthUser() user: User): Promise<LoginResponse> {
        return Promise.resolve({
            user,
            authToken: await this.authService.generateAccessToken({
                emailAddress: user.emailAddress,
                sub: user.id,
            }),
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

    @HttpCode(HttpStatus.OK)
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

    @HttpCode(HttpStatus.OK)
    @Post(endpoint('send-password-reset'))
    async sendPasswordReset(@Body() request: SendPasswordResetRequest): Promise<void> {
        const { emailAddress } = request
        if (!emailAddress.trim()) {
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

    @HttpCode(HttpStatus.OK)
    @Post(endpoint('password-reset'))
    async passwordReset(@Body() request: PasswordResetRequest): Promise<void> {
        const { emailAddress, code, password } = request
        if (!emailAddress.trim() || !code.trim()) {
            throw new BadRequestException('Email address and code required')
        }

        const resetPassword = await this.authService.getPasswordReset(emailAddress)
        if (!resetPassword) {
            throw new NotFoundException('No password request found')
        }

        if (code !== resetPassword.code) {
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

    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Post(endpoint('change-password'))
    async changePassword(
        @Request() req: AuthRequest,
        @Body() request: ChangePasswordRequest,
    ): Promise<void> {
        const { user } = req
        const { oldPassword, newPassword } = request

        if (!oldPassword.trim() || !newPassword.trim()) {
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

    @HttpCode(HttpStatus.OK)
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

    @HttpCode(HttpStatus.OK)
    @Post(endpoint('refresh'))
    async refreshToken(@Body() request: RefreshTokenRequest): Promise<AuthToken> {
        const { refreshToken } = request
        const user = await this.authService.getUserFromToken(refreshToken)
        if (!user) {
            throw new UnauthorizedException()
        }

        const oldToken = await this.authService.getAccessTokenByRefreshToken(user.id, refreshToken)
        if (!oldToken) {
            throw new UnauthorizedException()
        }

        await this.authService.deleteAccessToken(oldToken)

        const token = await this.authService.generateAccessToken({
            emailAddress: user.emailAddress,
            sub: user.id,
        })

        return token
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard)
    @Post(endpoint('logout'))
    async logout(
        @Headers('authorization') authorization: string,
        @AuthUser() user: User,
    ): Promise<void> {
        if (authorization) {
            const jwt = authorization.replace('Bearer ', '')
            await this.authService.deleteUserAccessToken(user.id, jwt)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post(endpoint('social'))
    async socialLogin(request: SocialAuthRequest): Promise<LoginResponse> {
        const { accessToken, provider, socialId } = request
        if (!accessToken || !socialId) {
            throw new BadRequestException('Missing request elements')
        }

        const socialProvider = this.socialAuthProvider.getSocialProvider(provider)

        let socialUser: SocialUser
        try {
            socialUser = await socialProvider.getSocialUser(accessToken)
        } catch (e: unknown) {
            throw new BadRequestException(`${provider} API errored`)
        }

        if (socialUser.id !== socialId) {
            throw new NotFoundException(`${provider} IDs do not match`)
        }

        let user = await this.userService.getByEmail(socialUser.emailAddress)
        if (!user) {
            user = User.create({
                emailAddress: socialUser.emailAddress,
                firstName: socialUser.firstName,
                lastName: socialUser.lastName,
                isVerified: true,
            })
            socialProvider.fillRemainingFields(user, socialUser)

            const errors = await validate(user)
            if (errors.length > 0) {
                throw new BadRequestException(errors)
            }

            await this.userService.save(user)
        }

        return {
            user,
            authToken: await this.authService.generateAccessToken({
                emailAddress: user.emailAddress,
                sub: user.id,
            }),
        }
    }
}
