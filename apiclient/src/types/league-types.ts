export type LeagueEndpoints = '/' | ':id'

export type LeagueRole = 'admin' | 'user'

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
    maxPlayersPerTeam: number
}

export type AddLeagueRequest = Omit<League, 'id' | 'createdById'>

export type LeagueResponse = {
    league: League
}

export type LeaguesResponse = {
    leagues: League[]
}

export type UpdateLeagueRequest = Partial<League>
