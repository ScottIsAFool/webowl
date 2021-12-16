import { Injectable } from '@nestjs/common'
import { generateSchedule } from 'sports-schedule-generator'

import type Match from 'sports-schedule-generator/lib/match'
import type { Team } from '../team/team.entity'

type MatchWith<T> = Required<Match<T>>

@Injectable()
export class FixtureService {
    generateAllFixtures(teams: Team[], _numberOfRounds: number): MatchWith<Team>[][] {
        return generateSchedule(teams, true) as MatchWith<Team>[][]
    }
}
