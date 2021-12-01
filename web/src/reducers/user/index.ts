import { userSlice } from './slice'

export const { reducer } = userSlice
export const actions = {
    ...userSlice.actions,
}
