import { BadRequestException } from '@nestjs/common'
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
    })

    describe('register', () => {
        test.each(['kwijibo'])('throws if password not strong enough', async (password: string) => {
            jest.spyOn(userService, 'getByEmail').mockImplementation(() =>
                Promise.resolve(undefined),
            )

            await expect(target.register({ ...HAPPY_REQUEST, password })).rejects.toEqual(
                new BadRequestException('Password not strong enough'),
            )
        })
    })
})
