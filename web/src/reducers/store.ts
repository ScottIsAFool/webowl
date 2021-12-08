import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { reducer as leagueUsersReducer } from './league-users'
import { reducer as leaguesReducer } from './leagues'
import { reducer as popupsReducer } from './popups'
import { reducer as seasonsReducer } from './seasons'
import { reducer as userReducer } from './user'

const rootReducer = combineReducers({
    authenticatedUser: userReducer,
    popups: popupsReducer,
    leagues: leaguesReducer,
    leagueUsers: leagueUsersReducer,
    seasons: seasonsReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
