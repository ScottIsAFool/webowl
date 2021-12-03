import { Injectable, Logger } from '@nestjs/common'
import MailService, { MailDataRequired } from '@sendgrid/mail'
import type { EmailVerification } from '../auth/email-verification.entity'
import type { PasswordReset } from '../auth/password-reset.entity'
import { getConfiguration } from '../config/configuration'
import { join } from 'path'

@Injectable()
export class EmailService {
    constructor() {
        MailService.setApiKey(getConfiguration().emailServiceKey)
    }

    private readonly logger = new Logger(EmailService.name)

    FROM = {
        name: 'Scott @ Webowl',
        email: 'scott@lovegrove.uk',
    }

    async sendEmailVerification(verification: EmailVerification): Promise<void> {
        const { emailAddress, verificationCode } = verification

        const url = new URL(join('auth', 'verify-email'), getConfiguration().baseWebUrl)
        url.searchParams.append('code', verificationCode)
        url.searchParams.append('email', emailAddress)

        const body = [`<p>Verify your email by clicking <a href="${url.toString()}">here</a>.</p>`]
        body.push(
            `<p>If the link doesn't work, copy this into your browser: ${url.toString()}.</p>`,
        )

        const message: MailDataRequired = {
            to: emailAddress,
            subject: 'Please verify your email address',
            from: this.FROM,
            html: body.join(''),
        }
        this.logger.debug(`Sent to ${emailAddress} with code ${verificationCode}`)
        await MailService.send(message)
    }

    async sendPasswordReset(passwordReset: PasswordReset): Promise<void> {
        const { emailAddress, code } = passwordReset

        const url = new URL(join('auth', 'password-reset'), getConfiguration().baseWebUrl)
        url.searchParams.append('code', code)
        url.searchParams.append('email', emailAddress)

        const body = [
            `<p>To reset your password, please click <a href="${url.toString()}">here</a>.</p>`,
        ]
        body.push(
            `<p>If the link doesn't work, copy this into your browser: ${url.toString()}.</p>`,
        )

        const message: MailDataRequired = {
            to: emailAddress,
            from: this.FROM,
            subject: 'Password reset request',
            html: body.join(''),
        }

        this.logger.debug(`Sent to ${emailAddress} with code ${code}`)
        await MailService.send(message)
    }
}
