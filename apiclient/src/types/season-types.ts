export type SeasonEndpoints = '/' | '/:seasonId' | '/:seasonId/teams'

export type Frequency = 7 | 14 | 28

export type Season = {
    id: number
    name?: string
    rounds: number
    frequency: Frequency
    time: string
    startDate: Date
    teamNumbers: number
    roundsPerDate: number
    startLane: number
    finished: boolean
    leagueId: number
}

type SeasonNoId = Omit<Season, 'id'>
type WithLeagueId = { leagueId: number }

type WithSeasonId = { seasonId: number }

export type GetSeasonsRequest = WithLeagueId

export type AddSeasonRequest = SeasonNoId

export type UpdateSeasonRequest = WithSeasonId & {
    season: Partial<SeasonNoId>
}

export type DeleteSeasonRequest = WithSeasonId

export type SeasonResponse = {
    season: Season
}

export type SeasonsResponse = {
    seasons: Season[]
}
