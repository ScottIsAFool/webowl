import { IsNotEmpty } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity()
@Unique(['emailAddress'])
export class PasswordReset {
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    emailAddress!: string

    @Column()
    @IsNotEmpty()
    code!: string

    @CreateDateColumn()
    createdAt!: Date

    static create(emailAddress: string): PasswordReset {
        const pw = new PasswordReset()
        pw.emailAddress = emailAddress
        pw.code = uuid()

        return pw
    }
}
