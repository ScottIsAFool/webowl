import type { League } from '@webowl/apiclient'

export type PopupsState = {
    addLeague?: boolean
    inviteToLeague?: boolean
    leagueToInviteTo?: League
}
