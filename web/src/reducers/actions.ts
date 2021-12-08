import { leagueUsersSlice } from './league-users/slice'
import { leaguesSlice } from './leagues/slice'
import { popupsSlice } from './popups/slice'
import { seasonsSlice } from './seasons/slice'
import { userSlice } from './user/slice'

export const actions = {
    ...userSlice.actions,
    ...popupsSlice.actions,
    ...leaguesSlice.actions,
    ...leagueUsersSlice.actions,
    ...seasonsSlice.actions,
}
