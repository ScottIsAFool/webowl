import { IsNotEmpty } from 'class-validator'
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm'

@Entity()
@Unique(['emailAddress'])
export class PasswordReset {
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    emailAddress!: string

    @Column()
    @IsNotEmpty()
    resetCode!: string

    static create(emailAddress: string, resetCode: string): PasswordReset {
        const pw = new PasswordReset()
        pw.emailAddress = emailAddress
        pw.resetCode = resetCode

        return pw
    }
}
