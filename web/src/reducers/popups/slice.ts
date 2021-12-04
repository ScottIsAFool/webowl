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
            state.league = action.payload
            return state
        },
        closeLeagueInvitiation(state, _action: PayloadAction) {
            state.inviteToLeague = false
            state.league = undefined
            return state
        },
        openManageLeague(state, action: PayloadAction<League>) {
            state.manageLeagueUsers = true
            state.league = action.payload
            return state
        },
        closeManageLeague(state, _action: PayloadAction) {
            state.manageLeagueUsers = false
            state.league = undefined
            return state
        },
    },
})
