import * as React from 'react'
import type { User } from '@webowl/apiclient'
import type { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'

const USER_FILE = 'u.json'

type UserManagementResult = {
    authenticatedUser?: User
    updateUser: (user?: User) => void
    setVerified: (value: boolean) => void
}

type ProviderProps = WithChildren

const UserContext = React.createContext<UserManagementResult>({
    updateUser: () => undefined,
    setVerified: () => undefined,
})

function UserProvider({ children }: ProviderProps): JSX.Element {
    const value = useUserManagementInternal()
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useUserManagementInternal(): UserManagementResult {
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

    return {
        authenticatedUser,
        updateUser,
        setVerified,
    }
}

function useUserManagement(): UserManagementResult {
    return React.useContext(UserContext)
}

export { useUserManagement, UserProvider }
