import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Fixture } from '../fixture/fixture.entity'
import { Player } from '../player/player.entity'
import { Season } from '../season/season.entity'

@Entity()
export class Team {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    name!: string

    @Column()
    isBYETeam!: boolean

    @OneToMany(() => Player, (player) => player.team, { eager: true })
    players!: Player[]

    @ManyToMany(() => Fixture, (fixture) => fixture.teams)
    fixtures!: Fixture[]

    @ManyToOne(() => Season, (season) => season.teams, { onDelete: 'CASCADE' })
    season!: Season

    static create(o: Partial<Team>): Team {
        const t = new Team()
        Object.assign(t, o)
        return t
    }
}
