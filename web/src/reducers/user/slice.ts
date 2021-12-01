import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@webowl/apiclient'
import { getFromStorage, saveToStorage } from '../../utils/storage-utils'
import type { UserState } from './types'

const USER_FILE = 'u.json'

const initialState: UserState = { authenticatedUser: getFromStorage<User>(USER_FILE) }

function save(user?: User) {
    if (user) {
        saveToStorage(USER_FILE, user)
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setVerified(state, action: PayloadAction<boolean>) {
            if (state.authenticatedUser) {
                state.authenticatedUser.verified = action.payload
            }

            save(state.authenticatedUser)
        },
        addOrUpdateUser(state, action: PayloadAction<User | undefined>) {
            const user = action.payload
            state.authenticatedUser = user
            save(user)
        },
    },
})
