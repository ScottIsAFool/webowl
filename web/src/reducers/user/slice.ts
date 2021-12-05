import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@webowl/apiclient'
import { getFromStorage, saveToStorage } from '../../utils/storage-utils'
import type { UserState } from './types'

const USER_FILE = 'u'

const initialState: UserState = getFromStorage<User>(USER_FILE)

function save(user?: User | null): User | undefined | null {
    if (user) {
        saveToStorage(USER_FILE, user)
    }

    return user
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState ?? null,
    reducers: {
        setVerified(state, action: PayloadAction<boolean>) {
            if (state) {
                state.verified = action.payload
            }

            return save(state)
        },
        addOrUpdateUser(state, action: PayloadAction<User | undefined | null>) {
            const user = action.payload
            state = user ?? null
            return save(user)
        },
    },
})
