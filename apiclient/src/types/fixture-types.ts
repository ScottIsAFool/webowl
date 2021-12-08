import type { Team } from './team-types'

export type Fixture = {
    id: number
    roundId: number
    team1: Team
    team2: Team
    startLane: number
}
