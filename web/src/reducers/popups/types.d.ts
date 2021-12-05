import type { League } from '@webowl/apiclient'

export type PopupsState = {
    addLeague?: boolean
    inviteToLeague?: boolean
    league?: League
    manageLeagueUsers?: boolean
    addSeason?: boolean
}
