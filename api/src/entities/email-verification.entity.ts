import { Column, Entity, Unique, PrimaryColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { v4 as uuid } from 'uuid'

@Entity()
@Unique(['emailAddress'])
export class EmailVerification {
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    emailAddress!: string

    @Column()
    @IsNotEmpty()
    verificationCode!: string

    @Column()
    @IsNotEmpty()
    userId!: number

    static create(emailAddress: string, userId: number): EmailVerification {
        const ev = new EmailVerification()
        ev.userId = userId
        ev.verificationCode = uuid()
        ev.emailAddress = emailAddress

        return ev
    }
}
