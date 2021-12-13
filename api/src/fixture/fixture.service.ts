import { Injectable } from '@nestjs/common'

import { generateRandomFixtureFromAllPermutations, MatchDay } from './fixture-generator'

import type { Team } from '../team/team.entity'

@Injectable()
export class FixtureService {
    async generateAllFixtures(teamIds: Team[], numberOfRounds: number): Promise<MatchDay<Team>[]> {
        const fixturesArray = await Promise.resolve(
            generateRandomFixtureFromAllPermutations(teamIds, numberOfRounds),
        )

        const fixtures = fixturesArray.reduce((fix, round) => [...fix, ...round], [])
        return fixtures
    }
}
