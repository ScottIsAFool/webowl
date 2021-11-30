import * as React from 'react'
import useCombinedReducers from 'use-combined-reducers'
import { UserActions, userInitialState, userReducer, UserState } from '../reducers'
import type { WithChildren } from '../types'

type StateResult = {
    state: State
    dispatch: (action: Actions) => void
}

type State = {
    user: UserState
}

type Actions = UserActions

const StateContext = React.createContext<StateResult>({} as StateResult)

function AppStateProvider({ children }: WithChildren): JSX.Element {
    const value = useAppStateInternal()
    return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}

function useAppStateInternal() {
    const [state, dispatch] = useCombinedReducers<State, Actions>({
        user: React.useReducer(userReducer, userInitialState),
    })

    return { state, dispatch }
}

function useAppState(): StateResult {
    return React.useContext(StateContext)
}

export { useAppState, AppStateProvider }
