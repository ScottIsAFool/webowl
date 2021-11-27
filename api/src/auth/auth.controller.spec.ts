import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type {
    PasswordResetRequest,
    RegisterRequest,
    SendPasswordResetRequest,
    VerifyRequest,
} from '@webowl/apiclient'
import { AuthController } from '.'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EmailVerification } from './email-verification.entity'
import { mockConnection } from '../../test/mocks'
import { AuthService } from './auth.service'
import { User, UserService } from '../user'
import { PasswordReset } from './password-reset.entity'
import { AccessToken } from './access-token.entity'
import { JwtModule } from '@nestjs/jwt'
import { SocialModule } from '../social/social.module'

const HAPPY_REGISTER_REQUEST: RegisterRequest = {
    emailAddress: 's@s.com',
    firstName: 'Scott',
    lastName: 'Lovegrove',
    password: 'Kwijb020!',
}

const HAPPY_VERIFY_EMAIL_REQUEST: VerifyRequest = {
    emailAddress: 's@s.com',
    verificationCode: 'kwijibo',
}

const HAPPY_EMAIL_ONLY_REQUEST: SendPasswordResetRequest = {
    emailAddress: 's@s.com',
}

const HAPPY_PASSWORD_RESET_REQUEST: PasswordResetRequest = {
    code: 'kwijibo',
    emailAddress: 's@s.com',
    password: 'Kwijibo20!',
}

describe('AuthController', () => {
    let target: AuthController
    let userService: UserService
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [JwtModule.register({}), SocialModule],
            providers: [
                UserService,
                AuthService,
                {
                    provide: getRepositoryToken(EmailVerification),
                    useFactory: mockConnection,
                },
                {
                    provide: getRepositoryToken(PasswordReset),
                    useFactory: mockConnection,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockConnection,
                },
                {
                    provide: getRepositoryToken(AccessToken),
                    useFactory: mockConnection,
                },
            ],
            controllers: [AuthController],
        }).compile()

        target = await module.resolve(AuthController)
        userService = await module.resolve(UserService)
        authService = await module.resolve(AuthService)
    })

    describe('register', () => {
        test.each([
            'kwijibo',
            'kwijibo2',
            'longpasswordnonumbers',
            'longpasswordnumber5nospecial',
            'longpassword!!',
            'valid exceptTheSpace20!',
        ])('throws if password (%p) not strong enough', async (password: string) => {
            setupGetUser()

            await expect(target.register({ ...HAPPY_REGISTER_REQUEST, password })).rejects.toEqual(
                new BadRequestException('Password not strong enough'),
            )
        })

        it('throws if existing user found', async () => {
            setupGetUser({})

            await expect(target.register(HAPPY_REGISTER_REQUEST)).rejects.toEqual(
                new ConflictException('Account already exists with that email address'),
            )
        })

        it('throws if email address not valid', async () => {
            setupGetUser()

            await expect(
                target.register({ ...HAPPY_REGISTER_REQUEST, emailAddress: 'not an email' }),
            ).rejects.toEqual(expect.any(BadRequestException))
        })

        it('saves user and adds email verification', async () => {
            setupGetUser()
            const saveUser = jest
                .spyOn(userService, 'save')
                .mockImplementation(() => Promise.resolve({} as User))

            const saveVerification = jest
                .spyOn(authService, 'saveEmailVerification')
                .mockImplementation(() => Promise.resolve({} as EmailVerification))

            await target.register(HAPPY_REGISTER_REQUEST)

            expect(saveUser).toHaveBeenCalledTimes(1)
            expect(saveVerification).toHaveBeenCalledTimes(1)
        })
    })

    describe('verify-email', () => {
        it('throws if no email or code provided', async () => {
            await expect(
                target.verifyEmail({ emailAddress: '', verificationCode: '' }),
            ).rejects.toEqual(new BadRequestException('Email address and code required'))
        })

        it('throws if no verification code found', async () => {
            setupGetVerification()
            await expect(target.verifyEmail(HAPPY_VERIFY_EMAIL_REQUEST)).rejects.toEqual(
                new BadRequestException('No verification code for this email address'),
            )
        })

        it('throws if verification codes do not match', async () => {
            setupGetVerification({ verificationCode: 'obijiwk' })
            await expect(target.verifyEmail(HAPPY_VERIFY_EMAIL_REQUEST)).rejects.toEqual(
                new BadRequestException('Verification code does not match'),
            )
        })

        it('throws if user not found for verification', async () => {
            setupGetVerification(HAPPY_VERIFY_EMAIL_REQUEST)
            setupGetUser()
            await expect(target.verifyEmail(HAPPY_VERIFY_EMAIL_REQUEST)).rejects.toEqual(
                new BadRequestException('User not found for this email address'),
            )
        })

        it('saves the user and deletes the verification', async () => {
            setupGetVerification(HAPPY_VERIFY_EMAIL_REQUEST)
            setupGetUser(HAPPY_REGISTER_REQUEST)
            const saveUser = jest
                .spyOn(userService, 'save')
                .mockImplementation(() => Promise.resolve({} as User))

            const deleteVerification = jest
                .spyOn(authService, 'deleteEmailVerification')
                .mockImplementation(() => Promise.resolve())

            await target.verifyEmail(HAPPY_VERIFY_EMAIL_REQUEST)

            expect(saveUser).toHaveBeenCalledTimes(1)
            expect(saveUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    isVerified: true,
                }),
            )

            expect(deleteVerification).toHaveBeenCalledTimes(1)
        })
    })

    describe('send-password-reset', () => {
        test.each(['', ' '])('throws if email invalid', async (email: string) => {
            await expect(target.sendPasswordReset({ emailAddress: email })).rejects.toEqual(
                new BadRequestException('Email address is required'),
            )
        })

        it('does nothing if user is not found', async () => {
            setupGetUser()
            const getPasswordReset = setupGetPasswordReset()

            await target.sendPasswordReset(HAPPY_EMAIL_ONLY_REQUEST)

            expect(getPasswordReset).not.toHaveBeenCalled()
        })

        it.skip('sends an email out', async () => {
            setupGetUser({})
            setupGetPasswordReset({})

            await target.sendPasswordReset(HAPPY_EMAIL_ONLY_REQUEST)

            // expect(getPasswordReset).not.toHaveBeenCalled()
        })
    })

    describe('password-reset', () => {
        test.each(['', ' '])('throws if email invalid', async (email: string) => {
            await expect(
                target.passwordReset({ ...HAPPY_PASSWORD_RESET_REQUEST, emailAddress: email }),
            ).rejects.toEqual(new BadRequestException('Email address and code required'))
        })

        test.each(['', ' '])('throws if code invalid', async (code: string) => {
            await expect(
                target.passwordReset({ ...HAPPY_PASSWORD_RESET_REQUEST, code }),
            ).rejects.toEqual(new BadRequestException('Email address and code required'))
        })

        it('throws if reset password not found for email', async () => {
            setupGetPasswordReset()
            await expect(target.passwordReset(HAPPY_PASSWORD_RESET_REQUEST)).rejects.toEqual(
                new NotFoundException('No password request found'),
            )
        })

        it('throws if code does not match password reset code', async () => {
            setupGetPasswordReset({ code: 'obijiwk' })
            await expect(target.passwordReset(HAPPY_PASSWORD_RESET_REQUEST)).rejects.toEqual(
                new BadRequestException('Codes do not match'),
            )
        })

        test.each([
            'kwijibo',
            'kwijibo2',
            'longpasswordnonumbers',
            'longpasswordnumber5nospecial',
            'longpassword!!',
            'valid exceptTheSpace20!',
        ])('throws if password (%p) not strong enough', async (password: string) => {
            setupGetPasswordReset(HAPPY_PASSWORD_RESET_REQUEST)

            await expect(
                target.passwordReset({ ...HAPPY_PASSWORD_RESET_REQUEST, password }),
            ).rejects.toEqual(new BadRequestException('Password not strong enough'))
        })

        it('throws if resulting user not found', async () => {
            setupGetPasswordReset(HAPPY_PASSWORD_RESET_REQUEST)
            setupGetUser()

            await expect(target.passwordReset(HAPPY_PASSWORD_RESET_REQUEST)).rejects.toEqual(
                new NotFoundException('User not found'),
            )
        })

        it('updates user and deletes password reset', async () => {
            const u = new User()
            Object.assign(u, {})
            setupGetPasswordReset(HAPPY_PASSWORD_RESET_REQUEST)
            jest.spyOn(userService, 'getByEmail').mockImplementation(() => Promise.resolve(u))

            const saveUser = jest
                .spyOn(userService, 'save')
                .mockImplementation(() => Promise.resolve({} as User))

            const deletePasswordReset = jest
                .spyOn(authService, 'deletePasswordReset')
                .mockImplementation(() => Promise.resolve())

            const hashPassword = jest.spyOn(u, 'hashPassword')

            await target.passwordReset(HAPPY_PASSWORD_RESET_REQUEST)

            expect(saveUser).toHaveBeenCalledTimes(1)
            expect(hashPassword).toHaveBeenCalled()

            expect(deletePasswordReset).toHaveBeenCalledTimes(1)
        })
    })

    function setupGetUser(user?: Partial<User>) {
        const u = new User()
        Object.assign(u, user)
        jest.spyOn(userService, 'getByEmail').mockImplementation(() =>
            Promise.resolve(user ? u : undefined),
        )
    }

    function setupGetVerification(verification?: Partial<EmailVerification>) {
        jest.spyOn(authService, 'getEmailVerification').mockImplementation(() =>
            Promise.resolve(verification as EmailVerification),
        )
    }

    function setupGetPasswordReset(reset?: Partial<PasswordReset>) {
        return jest
            .spyOn(authService, 'getPasswordReset')
            .mockImplementation(() => Promise.resolve(reset as PasswordReset))
    }
})
