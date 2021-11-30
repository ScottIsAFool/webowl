export type LeagueEndpoints = '/' | ':id'

export type League = {
    id: number
    name: string
    localAssociation?: string
    sanctionNumber?: string
    teamNumbers: number
    seriesGames: number
    playersPerTeam: number
    handicap: boolean
    scratch: boolean
    createdById: number
}

export type AddLeagueRequest = Omit<League, 'id'>

export type LeagueResponse = {
    league: League
}

export type LeaguesResponse = {
    leagues: League[]
}

export type UpdateLeagueRequest = Partial<League>
