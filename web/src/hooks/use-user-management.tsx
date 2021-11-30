import * as React from 'react'
import type { User, UserResponse } from '@webowl/apiclient'
import type { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'
import { makeCallWithValue, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'

const USER_FILE = 'u.json'

type UserManagementResult = {
    busy: boolean
    authenticatedUser?: User
    updateUser: (user?: User) => void
    setVerified: (value: boolean) => void
    refreshAuthenticatedUser: () => void
    getAuthenticatedUser: () => Promise<ResultWith<UserResponse>>
}

type ProviderProps = WithChildren

const UserContext = React.createContext<UserManagementResult>({
    busy: false,
    updateUser: () => undefined,
    setVerified: () => undefined,
    refreshAuthenticatedUser: () => undefined,
    getAuthenticatedUser: () => Promise.resolve({ type: 'idle' }),
})

function UserProvider({ children }: ProviderProps): JSX.Element {
    const value = useUserManagementInternal()
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useUserManagementInternal(): UserManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const [authenticatedUser, setAuthenticatedUser] = React.useState<User | undefined>(
        getFromStorage(USER_FILE),
    )

    const updateUser = React.useCallback(function updateUser(user?: User) {
        if (user) {
            saveToStorage(USER_FILE, user)
            setAuthenticatedUser(user)
        } else {
            removeFromStorage(USER_FILE)
            setAuthenticatedUser(undefined)
        }
    }, [])

    const setVerified = React.useCallback(
        function setVerified(value: boolean) {
            if (!authenticatedUser) return
            updateUser({
                ...authenticatedUser,
                verified: value,
            })
        },
        [authenticatedUser, updateUser],
    )

    const getAuthenticatedUser = React.useCallback(
        function getAuthenticatedUser(): Promise<ResultWith<UserResponse>> {
            return makeCallWithValue(() => apiClient.getAuthenticatedUser(), setBusy)
        },
        [apiClient],
    )

    const refreshAuthenticatedUser = React.useCallback(
        async function refreshAuthenticatedUser() {
            const response = await getAuthenticatedUser()
            if (response.type === 'error') {
                // Display an error
            } else if (response.type === 'success') {
                updateUser(response.value.user)
            }
        },
        [getAuthenticatedUser, updateUser],
    )

    return {
        busy,
        authenticatedUser,
        updateUser,
        setVerified,
        getAuthenticatedUser,
        refreshAuthenticatedUser,
    }
}

function useUserManagement(): UserManagementResult {
    return React.useContext(UserContext)
}

export { useUserManagement, UserProvider }
