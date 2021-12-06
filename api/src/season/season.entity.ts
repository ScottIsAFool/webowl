import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Frequency, Season as SeasonDto } from '@webowl/apiclient'
import { League } from '../league/league.entity'
import { Max, Min } from 'class-validator'

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

    @Column()
    finished!: boolean

    @Column()
    handicap!: boolean

    @Column()
    scratch!: boolean

    @Column({ nullable: true })
    @Min(1)
    @Max(100)
    handicapPercent?: number

    @Column({ nullable: true })
    handicapOf?: number

    @Column()
    hasMaxHandicap!: boolean

    @Column({ nullable: true })
    maxHandicap?: number

    @CreateDateColumn()
    createdAt!: Date

    @ManyToOne(() => League, (league) => league.seasons, { eager: true })
    league!: League

    static create(o: Partial<Season>): Season {
        const s = new Season()
        Object.assign(s, o)
        return s
    }

    toDto(): SeasonDto {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { league, createdAt, ...rest } = this
        return {
            ...rest,
            leagueId: league.id,
        }
    }
}
