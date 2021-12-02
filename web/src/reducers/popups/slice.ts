import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PopupsState } from './types'

const initialState: PopupsState = {}

export const popupsSlice = createSlice({
    name: 'popups',
    initialState,
    reducers: {
        addLeaguePopup(state, open: PayloadAction<boolean | undefined>) {
            state.addLeague = open.payload
            return state
        },
    },
})
