import type { User } from '.'

export type LeagueEndpoints = '/' | '/:id' | '/:id/users' | '/accept-invite'

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

export type LeagueUser = Pick<User, 'id' | 'firstName' | 'lastName' | 'emailAddress'> & {
    role: LeagueRole
}

export type AddLeagueRequest = Omit<League, 'id' | 'createdById'>

export type LeagueResponse = {
    league: League
}

export type LeaguesResponse = {
    leagues: League[]
}

export type UpdateLeagueRequest = Partial<League>

export type LeagueUsersResponse = {
    users: LeagueUser[]
}

export type InviteToLeagueRequest = {
    emailAddress: string
}

export type AcceptLeagueInviteRequest = {
    inviteCode: string
}
