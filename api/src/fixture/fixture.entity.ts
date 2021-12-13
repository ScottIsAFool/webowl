import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Round } from '../round/round.entity'
import { Team } from '../team/team.entity'

import type { Fixture as FixtureDto } from '@webowl/apiclient'

@Entity()
export class Fixture {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    startLane!: number

    @ManyToOne(() => Round, (round) => round.fixtures, { onDelete: 'CASCADE', eager: true })
    round!: Round

    @ManyToMany(() => Team, (team) => team.fixtures)
    @JoinTable()
    teams!: Team[]

    toDto(): FixtureDto {
        return {
            id: this.id,
            roundId: this.round.id,
            startLane: this.startLane,
            team1: this.teams[0],
            team2: this.teams[1],
        }
    }
}
