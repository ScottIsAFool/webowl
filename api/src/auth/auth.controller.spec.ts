import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import type { RegisterRequest } from '@webowl/apiclient'
import { Connection } from 'typeorm'
import { AuthController, AuthModule } from '.'
import { User } from '../entities'
import { EmailVerificationRepository, UserRepository } from '../repositories'

const HAPPY_REQUEST: RegisterRequest = {
    emailAddress: 's@s.com',
    firstName: 'Scott',
    lastName: 'Lovegrove',
    password: 'Kwijb020!',
}

export function mockConnection(): Record<string, unknown> {
    return {
        getRepository: jest.fn(),
    }
}

describe('AuthController', () => {
    let target: AuthController
    let userRepo: UserRepository
    let emailRepo: EmailVerificationRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AuthModule, TypeOrmModule],
        }).compile()

        target = await module.resolve(AuthController)
        userRepo = await module.resolve(UserRepository)
        emailRepo = await module.resolve(EmailVerificationRepository)
    })

    describe('register', () => {
        test.each(['kwijibo'])('throws if password not strong enough', async (password: string) => {
            jest.spyOn(userRepo, 'getUser').mockImplementation(() => Promise.resolve(undefined))

            await expect(target.register({ ...HAPPY_REQUEST, password })).rejects.toEqual(
                new BadRequestException('Password not strong enough'),
            )
        })
    })
})
