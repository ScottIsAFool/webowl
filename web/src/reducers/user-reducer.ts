import type { User } from '@webowl/apiclient'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'

const USER_FILE = 'u.json'

type State = {
    authenticatedUser?: User
}

type Action =
    | { type: 'update-user'; user?: User }
    | { type: 'set-verified'; value: boolean }
    | { type: 'delete-user' }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'delete-user':
            state.authenticatedUser = undefined
            removeFromStorage(USER_FILE)
            break
        case 'set-verified': {
            const { value } = action
            if (state.authenticatedUser) {
                state.authenticatedUser.verified = value
            }
            break
        }
        case 'update-user': {
            const { user } = action
            state.authenticatedUser = user
            if (user) {
                saveToStorage(USER_FILE, user)
            } else {
                removeFromStorage(USER_FILE)
            }
            break
        }
    }

    return state
}

const initialState = { authenticatedUser: getFromStorage<User>(USER_FILE) }

export type { Action as UserActions, State as UserState }
export { reducer as userReducer, initialState as userInitialState }
