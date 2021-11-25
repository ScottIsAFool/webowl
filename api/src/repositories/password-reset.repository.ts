import { Injectable } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { PasswordReset } from '../entities'

@Injectable()
@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {
    get(emailAddress: string): Promise<PasswordReset | undefined> {
        return this.findOne({ where: { emailAddress } })
    }
}
