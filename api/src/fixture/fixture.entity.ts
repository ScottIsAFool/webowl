import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Round } from '../round/round.entity'
import { Team } from '../team/team.entity'

@Entity()
export class Fixture {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    startLane!: number

    @ManyToOne(() => Round, (round) => round.fixtures, { onDelete: 'CASCADE' })
    round!: Round

    @ManyToMany(() => Team, (team) => team.fixtures)
    @JoinTable()
    teams!: Team[]
}
