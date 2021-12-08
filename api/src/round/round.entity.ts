import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Fixture } from '../fixture/fixture.entity'
import { Season } from '../season/season.entity'

@Entity()
export class Round {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column({ type: 'timestamptz' })
    date!: Date

    @Column()
    isEmpty!: boolean

    @Column({ nullable: true })
    emptyReason?: string

    @OneToMany(() => Fixture, (fixture) => fixture.round)
    fixtures!: Fixture[]

    @ManyToOne(() => Season, (season) => season.allRounds)
    season!: Season
}
