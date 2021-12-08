import type { AgeType, Gender } from '@webowl/apiclient'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Team } from '../team/team.entity'

@Entity()
export class Player {
    @PrimaryGeneratedColumn('increment')
    id!: number

    @Column()
    name!: string

    @Column()
    isFloatingSub!: boolean

    @Column()
    gender!: Gender

    @Column()
    ageType!: AgeType

    @Column({ type: 'timestamptz', nullable: true })
    dob?: Date

    @ManyToOne(() => Team, (team) => team.players, { nullable: true })
    team?: Team
}
