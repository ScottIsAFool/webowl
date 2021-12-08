import { join } from 'path'

import { Injectable, Logger } from '@nestjs/common'
import MailService, { MailDataRequired } from '@sendgrid/mail'

import { getConfiguration } from '../config/configuration'
import { isProduction } from '../utils/env-utils'

import type { EmailVerification } from '../auth/email-verification.entity'
import type { PasswordReset } from '../auth/password-reset.entity'
import type { LeagueInvite } from '../league/league-invite.entity'

@Injectable()
export class EmailService {
    constructor() {
        MailService.setApiKey(getConfiguration().emailServiceKey)
    }

    private readonly logger = new Logger(EmailService.name)

    private readonly FROM = {
        name: 'Scott @ Webowl',
        email: 'scott@lovegrove.uk',
    }

    sendEmailVerification(verification: EmailVerification): Promise<void> {
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
        return this.send(message)
    }

    sendPasswordReset(passwordReset: PasswordReset): Promise<void> {
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
        return this.send(message)
    }

    sendLeagueInvitation(invite: LeagueInvite): Promise<void> {
        const url = new URL(join('leagues', 'accept-invite'), getConfiguration().baseWebUrl)
        url.searchParams.append('inviteCode', invite.inviteCode)

        const body = [
            `<p>${invite.invitee.firstName} ${invite.invitee.lastName} has invited you to join the ${invite.league.name} league on Webowl.</p>`,
        ]
        body.push(`<p>Webowl is a league management platform</p>`)
        body.push(`<p>To accept your invite please click <a href="${url.toString()}">here</a>.</p>`)
        body.push(
            `<p>If the link doesn't work, copy this into your browser: ${url.toString()}.</p>`,
        )

        const message: MailDataRequired = {
            to: invite.inviteEmail,
            from: this.FROM,
            subject: `You have been invite to join the ${invite.league.name} league`,
            html: body.join(''),
        }

        this.logger.debug(`Sent to ${invite.inviteEmail} with code ${invite.inviteCode}`)
        return this.send(message)
    }

    async send(message: MailDataRequired): Promise<void> {
        if (isProduction()) {
            await MailService.send(message)
        }
    }
}
