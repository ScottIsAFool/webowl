import { IsNotEmpty } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm'
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

    @CreateDateColumn()
    createdAt!: Date

    static create(emailAddress: string, userId: number): EmailVerification {
        const ev = new EmailVerification()
        ev.userId = userId
        ev.verificationCode = uuid()
        ev.emailAddress = emailAddress

        return ev
    }
}
