import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EmailVerification } from './email-verification.entity'
import { mockConnection } from '../../test/mocks'
import { AuthService } from './auth.service'
import { User, UserService } from '../user'
import { PasswordReset } from './password-reset.entity'
import { AccessToken } from './access-token.entity'
import { JwtModule } from '@nestjs/jwt'

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
