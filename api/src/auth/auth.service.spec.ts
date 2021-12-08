import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { mockConnection } from '../../test/mocks'
import { User, UserService } from '../user'

import { AccessToken } from './access-token.entity'
import { AuthService } from './auth.service'
import { EmailVerification } from './email-verification.entity'
import { PasswordReset } from './password-reset.entity'

describe('AuthService', () => {
    let target: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule.register({})],
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
        }).compile()

        target = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(target).toBeDefined()
    })
})
