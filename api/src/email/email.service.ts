import { Injectable, Logger } from '@nestjs/common'
import type { EmailVerification } from '../auth/email-verification.entity'
import type { PasswordReset } from '../auth/password-reset.entity'

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name)

    sendEmailVerification(verification: EmailVerification): Promise<void> {
        const { emailAddress, verificationCode } = verification
        this.logger.debug(`Sent to ${emailAddress} with code ${verificationCode}`)
        return Promise.resolve()
    }

    sendPasswordReset(passwordReset: PasswordReset): Promise<void> {
        const { emailAddress, code } = passwordReset
        this.logger.debug(`Sent to ${emailAddress} with code ${code}`)
        return Promise.resolve()
    }
}
