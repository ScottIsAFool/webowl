import { userSlice } from './user/slice'
import { popupsSlice } from './popups/slice'
import { leaguesSlice } from './leagues/slice'

export const actions = {
    ...userSlice.actions,
    ...popupsSlice.actions,
    ...leaguesSlice.actions,
}
