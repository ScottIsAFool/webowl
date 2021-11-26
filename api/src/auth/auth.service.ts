import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import type { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { EmailVerification } from './email-verification.entity'
import { PasswordReset } from './password-reset.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(EmailVerification)
        private readonly verifyRepo: Repository<EmailVerification>,
        @InjectRepository(PasswordReset)
        private readonly passwordRepo: Repository<PasswordReset>,
    ) {}

    async validateUser(emailAddress: string, password: string): Promise<User | undefined> {
        const user = await this.userService.getByEmail(emailAddress)
        if (user && user.checkIfPasswordIsValid(password)) {
            return user
        }

        return undefined
    }

    getEmailVerification(emailAddress: string): Promise<EmailVerification | undefined> {
        return this.verifyRepo.findOne({ where: { emailAddress } })
    }

    saveEmailVerification(verification: EmailVerification): Promise<EmailVerification> {
        return this.verifyRepo.save(verification)
    }

    async deleteEmailVerification(verification: EmailVerification): Promise<void> {
        await this.verifyRepo.remove(verification)
    }

    getPasswordReset(emailAddress: string): Promise<PasswordReset | undefined> {
        return this.passwordRepo.findOne({ where: { emailAddress } })
    }

    async deletePasswordReset(passwordReset: PasswordReset): Promise<void> {
        await this.passwordRepo.remove(passwordReset)
    }
}
