import { Injectable } from '@nestjs/common'

import { Team } from './team.entity'

@Injectable()
export class TeamService {
    createBaseTeams(numberOfTeams: number): Team[] {
        const teams: Team[] = []
        for (let index = 1; index <= numberOfTeams; index++) {
            const team = Team.create({ name: `Team${index}`, isBYETeam: false })
            teams.push(team)
        }

        return teams
    }
}
