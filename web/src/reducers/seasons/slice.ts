import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { saveToStorage } from '../../utils/storage-utils'

import type { Season } from '@webowl/apiclient'
import type { SeasonsByLeague, SeasonsState } from './types'

const SEASONS_FILE = 's'

const initialState: SeasonsState = {}

function save(state: SeasonsState): SeasonsState {
    saveToStorage(SEASONS_FILE, state)
    return state
}

export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        addOrUpdateSeasons(state, action: PayloadAction<SeasonsByLeague>) {
            const { leagueId, seasons } = action.payload

            state[leagueId] = seasons

            return save(state)
        },
        addSeason(state, action: PayloadAction<Season>) {
            const { leagueId } = action.payload

            state[leagueId].push(action.payload)
            return save(state)
        },
    },
})
