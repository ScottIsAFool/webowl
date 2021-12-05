import type { Season } from '@webowl/apiclient'

export type SeasonsState = {
    [leagueId: number]: Season[]
}

export type SeasonsByLeague = {
    leagueId: number
    seasons: Season[]
}
