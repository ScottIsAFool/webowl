import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducer as userReducer } from './user'
import { reducer as popupsReducer } from './popups'
import { reducer as leaguesReducer } from './leagues'
import { reducer as leagueUsersReducer } from './league-users'

const rootReducer = combineReducers({
    authenticatedUser: userReducer,
    popups: popupsReducer,
    leagues: leaguesReducer,
    leagueUsers: leagueUsersReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
