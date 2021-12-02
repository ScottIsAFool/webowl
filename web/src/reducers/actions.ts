import { userSlice } from './user/slice'
import { popupsSlice } from './popups/slice'
import { leaguesSlice } from './leagues/slice'
import { leagueUsersSlice } from './league-users/slice'

export const actions = {
    ...userSlice.actions,
    ...popupsSlice.actions,
    ...leaguesSlice.actions,
    ...leagueUsersSlice.actions,
}
