import type { LeagueUser } from '@webowl/apiclient'

export type LeagueUsersState = {
    [leagueId: number]: LeagueUser[]
}

export type UsersByLeague = {
    leagueId: number
    users: LeagueUser[]
}
