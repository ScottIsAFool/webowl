import { userSlice } from './user/slice'
import { popupsSlice } from './popups/slice'

export const actions = {
    ...userSlice.actions,
    ...popupsSlice.actions,
}
