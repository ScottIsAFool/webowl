import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import {
    DEFAULT_STANDING_RULES,
    Frequency,
    Season as SeasonDto,
    StandingsTypes,
} from '@webowl/apiclient'
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

    @Column({ nullable: true })
    finished?: boolean

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

    @Column({ default: DEFAULT_STANDING_RULES.rule1 })
    handicapStandingRule1!: StandingsTypes

    @Column({ default: DEFAULT_STANDING_RULES.rule2 })
    handicapStandingRule2!: StandingsTypes

    @Column({ default: DEFAULT_STANDING_RULES.rule3 })
    handicapStandingRule3!: StandingsTypes

    @Column({ default: DEFAULT_STANDING_RULES.rule1 })
    scratchStandingRule1!: StandingsTypes

    @Column({ default: DEFAULT_STANDING_RULES.rule2 })
    scratchStandingRule2!: StandingsTypes

    @Column({ default: DEFAULT_STANDING_RULES.rule3 })
    scratchStandingRule3!: StandingsTypes

    @Column()
    handicapPointsPerGame!: number

    @Column()
    scratchPointsPerGame!: number

    @CreateDateColumn()
    createdAt!: Date

    @ManyToOne(() => League, (league) => league.seasons, { eager: true })
    league!: League

    static create(o: Partial<SeasonDto>): Season {
        const s = new Season()
        Object.assign(s, o)
        s.handicapStandingRule1 = o.handicapStandingRules?.rule1 ?? DEFAULT_STANDING_RULES.rule1
        s.handicapStandingRule2 = o.handicapStandingRules?.rule2 ?? DEFAULT_STANDING_RULES.rule2
        s.handicapStandingRule3 = o.handicapStandingRules?.rule3 ?? DEFAULT_STANDING_RULES.rule3
        s.scratchStandingRule1 = o.scratchStandingRules?.rule1 ?? DEFAULT_STANDING_RULES.rule1
        s.scratchStandingRule2 = o.scratchStandingRules?.rule2 ?? DEFAULT_STANDING_RULES.rule2
        s.scratchStandingRule3 = o.scratchStandingRules?.rule3 ?? DEFAULT_STANDING_RULES.rule3
        return s
    }

    toDto(): SeasonDto {
        const {
            league,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            createdAt,
            handicapStandingRule1,
            handicapStandingRule2,
            handicapStandingRule3,
            scratchStandingRule1,
            scratchStandingRule2,
            scratchStandingRule3,
            ...rest
        } = this
        return {
            ...rest,
            leagueId: league.id,
            handicapStandingRules: {
                rule1: handicapStandingRule1,
                rule2: handicapStandingRule2,
                rule3: handicapStandingRule3,
            },
            scratchStandingRules: {
                rule1: scratchStandingRule1,
                rule2: scratchStandingRule2,
                rule3: scratchStandingRule3,
            },
        }
    }
}
