import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EmailVerification } from './email-verification.entity'
import { mockConnection } from '../../test/mocks'
import { AuthService } from './auth.service'
import { User, UserService } from '../user'
import { PasswordReset } from './password-reset.entity'

describe('AuthService', () => {
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
