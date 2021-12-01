import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducer as userReducer } from './user'
import { reducer as popupsReducer } from './popups'
import { reducer as leaguesReducer } from './leagues'

const rootReducer = combineReducers({
    user: userReducer,
    popups: popupsReducer,
    leagues: leaguesReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
