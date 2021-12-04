import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { League } from '@webowl/apiclient'
import type { PopupsState } from './types'

const initialState: PopupsState = {}

export const popupsSlice = createSlice({
    name: 'popups',
    initialState,
    reducers: {
        addLeaguePopup(state, action: PayloadAction<boolean | undefined>) {
            state.addLeague = action.payload
            return state
        },
        openLeagueInvitation(state, action: PayloadAction<League>) {
            state.inviteToLeague = true
            state.leagueToInviteTo = action.payload
            return state
        },
        closeLeagueInvitiation(state, _action: PayloadAction) {
            state.inviteToLeague = false
            state.leagueToInviteTo = undefined
            return state
        },
    },
})
