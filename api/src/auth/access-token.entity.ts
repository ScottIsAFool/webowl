import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { getEncryptionTransformer } from './auth.utils'
import dayjs from 'dayjs'
import { getConfiguration } from '../config/configuration'

@Entity()
export class AccessToken {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    userId!: number

    @Column({
        transformer: getEncryptionTransformer(),
    })
    accessToken!: string

    @Column({
        transformer: getEncryptionTransformer(),
    })
    refreshToken!: string

    @Column()
    expiresAt!: number

    @CreateDateColumn()
    createdAt!: Date

    static create(o: { accessToken: string; userId: number; refreshToken: string }): AccessToken {
        const at = new AccessToken()
        Object.assign(at, o)
        at.expiresAt = Math.floor(
            dayjs().add(getConfiguration().expiryTime, 'minutes').toDate().getTime() / 1000,
        )
        return at
    }
}
