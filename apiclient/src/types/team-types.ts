export type Team = {
    id: number
    name: string
    isBYETeam: boolean
}

type TeamNoId = Omit<Team, 'id'>

export type AddTeamRequest = TeamNoId
export type UpdateTeamRequest = Partial<TeamNoId>

export type TeamResponse = {
    team: Team
}

export type TeamsResponse = {
    teams: Team[]
}
