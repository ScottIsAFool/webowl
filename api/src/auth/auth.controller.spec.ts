import { BadRequestException, ConflictException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { RegisterRequest } from '@webowl/apiclient'
import { AuthController } from '.'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EmailVerification } from './email-verification.entity'
import { mockConnection } from '../../test/mocks'
import { AuthService } from './auth.service'
import { User, UserService } from '../user'
import { PasswordReset } from './password-reset.entity'

const HAPPY_REQUEST: RegisterRequest = {
    emailAddress: 's@s.com',
    firstName: 'Scott',
    lastName: 'Lovegrove',
    password: 'Kwijb020!',
}

describe('AuthController', () => {
    let target: AuthController
    let userService: UserService
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
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
            setupUserServiceUser()

            await expect(target.register({ ...HAPPY_REQUEST, password })).rejects.toEqual(
                new BadRequestException('Password not strong enough'),
            )
        })

        it('throws if existing user found', async () => {
            setupUserServiceUser({})

            await expect(target.register(HAPPY_REQUEST)).rejects.toEqual(
                new ConflictException('Account already exists with that email address'),
            )
        })

        it('throws if email address not valid', async () => {
            setupUserServiceUser()

            await expect(
                target.register({ ...HAPPY_REQUEST, emailAddress: 'not an email' }),
            ).rejects.toEqual(expect.any(BadRequestException))
        })

        it('saves user and adds email verification', async () => {
            setupUserServiceUser()
            const saveUser = jest
                .spyOn(userService, 'save')
                .mockImplementation(() => Promise.resolve({} as User))

            const saveVerification = jest
                .spyOn(authService, 'saveEmailVerification')
                .mockImplementation(() => Promise.resolve({} as EmailVerification))

            await target.register(HAPPY_REQUEST)

            expect(saveUser).toHaveBeenCalledTimes(1)
            expect(saveVerification).toHaveBeenCalledTimes(1)
        })
    })

    function setupUserServiceUser(user?: Partial<User>) {
        jest.spyOn(userService, 'getByEmail').mockImplementation(() =>
            Promise.resolve(user as User),
        )
    }
})
