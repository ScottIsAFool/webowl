import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducer as userReducer } from './user'
import { reducer as popupsReducer } from './popups'

const rootReducer = combineReducers({
    user: userReducer,
    popups: popupsReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
