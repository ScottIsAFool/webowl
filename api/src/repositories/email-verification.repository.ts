import { Injectable } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { EmailVerification } from '../entities'

@Injectable()
@EntityRepository(EmailVerification)
export class EmailVerificationRepository extends Repository<EmailVerification> {
    get(emailAddress: string): Promise<EmailVerification | undefined> {
        return this.findOne({ where: { emailAddress } })
    }
}
