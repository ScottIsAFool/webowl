import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveToStorage } from '../../utils/storage-utils'
import type { LeagueUsersState, UsersByLeague } from './types'

const LEAGUE_USERS_FILE = 'lu.json'

const initialState: LeagueUsersState = {}

function save(state: LeagueUsersState): LeagueUsersState {
    saveToStorage(LEAGUE_USERS_FILE, state)
    return state
}

export const leagueUsersSlice = createSlice({
    name: 'leagueUsers',
    initialState,
    reducers: {
        addOrUpdateLeagueUsers(state, action: PayloadAction<UsersByLeague>) {
            const { leagueId, users } = action.payload

            state[leagueId] = users

            return save(state)
        },
    },
})
