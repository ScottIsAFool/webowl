import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Frequency, Season as SeasonDto } from '@webowl/apiclient'
import { League } from '../league/league.entity'

@Entity()
export class Season {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column({ nullable: true })
    name?: string

    @Column()
    rounds!: number

    @Column()
    frequency!: Frequency

    @Column()
    time!: string

    @Column({ type: 'timestamptz' })
    startDate!: Date

    @Column()
    teamNumbers!: number

    @Column({ default: 1 })
    roundsPerDate!: number

    @Column()
    startLane!: number

    @Column({ default: false })
    finished!: boolean

    @ManyToOne(() => League, (league) => league.seasons, { eager: true })
    league!: League

    static create(o: Partial<Season>): Season {
        const s = new Season()
        Object.assign(s, o)
        return s
    }

    toDto(): SeasonDto {
        const { league, ...rest } = this
        return {
            ...rest,
            leagueId: league.id,
        }
    }
}
