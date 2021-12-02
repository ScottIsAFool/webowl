import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { LeagueRole as Role } from '@webowl/apiclient'
import { User } from '../user/user.entity'
import { League } from './league.entity'

@Entity()
export class LeagueRole {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @ManyToOne(() => User, { eager: true })
    user!: User

    @ManyToOne(() => League, { eager: true })
    league!: League

    @Column()
    role!: Role

    @CreateDateColumn()
    createdAt!: Date

    static create(o: Partial<LeagueRole>): LeagueRole {
        const lr = new LeagueRole()
        Object.assign(lr, o)
        return lr
    }
}
