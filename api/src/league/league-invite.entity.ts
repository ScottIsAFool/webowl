import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { User } from '../user/user.entity'

import { League } from './league.entity'

@Entity()
export class LeagueInvite {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @CreateDateColumn()
    createdAt!: Date

    @Column()
    inviteCode!: string

    @Column()
    inviteEmail!: string

    @ManyToOne(() => User, (user) => user.invites, { eager: true })
    invitee!: User

    @ManyToOne(() => League, (league) => league.invites, { eager: true })
    league!: League

    static create(o: Partial<LeagueInvite>): LeagueInvite {
        const li = new LeagueInvite()
        Object.assign(li, o)
        li.inviteCode = uuid()
        return li
    }
}
