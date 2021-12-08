import { IsDefined, Length, Min } from 'class-validator'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

import { Season } from '../season/season.entity'
import { User } from '../user/user.entity'

import { LeagueInvite } from './league-invite.entity'
import { LeagueRole } from './league-role.entity'

import type { League as LeagueDto } from '@webowl/apiclient'

@Entity()
export class League {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    @Length(4, 100)
    @IsDefined()
    name!: string

    @Column({ nullable: true })
    localAssociation?: string

    @Column({ nullable: true })
    sanctionNumber?: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @Column()
    @Min(1)
    teamNumbers!: number

    @Column()
    @Min(1)
    seriesGames!: number

    @Column()
    @Min(1)
    playersPerTeam!: number

    @Column()
    handicap!: boolean

    @Column()
    scratch!: boolean

    @Column({ default: 8 })
    maxPlayersPerTeam!: number

    @Column({ nullable: true })
    activeSeasonId?: number

    @ManyToOne(() => User, (user) => user.leagues, { eager: true })
    createdBy!: User

    @OneToMany(() => LeagueRole, (role) => role.league, { cascade: true })
    leagueRoles!: LeagueRole[]

    @OneToMany(() => LeagueInvite, (invite) => invite.league, { cascade: true })
    invites!: LeagueInvite[]

    @OneToMany(() => Season, (season) => season.league, { cascade: true })
    seasons!: Season[]

    static create(o: Partial<League>): League {
        const league = new League()
        Object.assign(league, o)
        return league
    }

    toDto(): LeagueDto {
        return {
            id: this.id,
            name: this.name,
            localAssociation: this.localAssociation,
            sanctionNumber: this.sanctionNumber,
            teamNumbers: this.teamNumbers,
            seriesGames: this.seriesGames,
            playersPerTeam: this.playersPerTeam,
            handicap: this.handicap,
            scratch: this.scratch,
            createdById: this.createdBy.id,
            maxPlayersPerTeam: this.maxPlayersPerTeam,
            activeSeasonId: this.activeSeasonId,
        }
    }
}
