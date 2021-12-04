import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { LeagueUser } from '@webowl/apiclient'
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
        updateLeagueUser(state, action: PayloadAction<{ leagueId: number; user: LeagueUser }>) {
            const { leagueId, user } = action.payload

            const users = state[leagueId]

            const existingUser = users.find((x) => x.id === user.id)
            if (!existingUser) return state

            const index = users.indexOf(existingUser)
            users[index] = user
            state[leagueId] = users
            return save(state)
        },
    },
})
