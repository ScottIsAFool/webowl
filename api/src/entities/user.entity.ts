import { IsEmail, Length, ValidateIf } from 'class-validator'
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'
import { hashSync, compareSync } from 'bcryptjs'
import type { User as UserDto } from '@webowl/apiclient'

@Entity()
@Unique(['emailAddress'])
export class User {
    @PrimaryGeneratedColumn('identity')
    id!: number

    @Column()
    @Length(4, 50)
    @IsEmail()
    emailAddress!: string

    @Column({ nullable: true })
    @Length(4, 100)
    @ValidateIf((x) => !x.isFacebookAuth && !x.isGoogleAuth && !x.isMicrosoftAuth)
    password!: string

    @Column()
    @Length(2, 50)
    firstName!: string

    @Column()
    @Length(2, 100)
    lastName!: string

    @CreateDateColumn()
    created!: Date

    @UpdateDateColumn()
    updated!: Date

    @Column({ nullable: true })
    isVerified!: boolean

    @Column({ nullable: true })
    isFacebookAuth!: boolean

    @Column({ nullable: true })
    facebookId!: string

    @Column({ nullable: true })
    googleId!: string

    @Column({ nullable: true })
    isGoogleAuth!: boolean

    @Column({ nullable: true })
    googleAccessToken!: string

    @Column({ nullable: true })
    microsoftId!: string

    @Column({ nullable: true })
    microsoftAccessToken!: string

    @Column({ nullable: true })
    isMicrosoftAuth!: boolean

    hashPassword(): void {
        this.password = hashSync(this.password, 8)
    }

    checkIfPasswordIsValid(unencryptedPassword: string): boolean {
        return compareSync(unencryptedPassword, this.password)
    }

    toDto(): UserDto {
        return {
            id: this.id,
            emailAddress: this.emailAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            isFacebookAuth: this.isFacebookAuth,
            isGoogleAuth: this.isGoogleAuth,
            isMicrosoftAuth: this.isMicrosoftAuth,
        }
    }
}
