import * as React from 'react'
import type { AuthToken, User } from '@webowl/apiclient'
import type { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'
import { useAppState } from '.'

const AUTH_FILE = 't.json'

type AuthDetails = {
    authToken?: AuthToken
    user?: User
}

type AuthResult = {
    isAuthenticated: boolean
    authToken?: AuthToken
    updateAuthToken: (token: AuthToken) => void
    logOut: () => void
    updateAuthDetails: (details: AuthDetails) => void
}

type ProviderProps = WithChildren

const AuthContext = React.createContext<AuthResult>({
    isAuthenticated: false,
    updateAuthToken: () => undefined,
    logOut: () => undefined,
    updateAuthDetails: () => undefined,
})

function AuthProvider({ children }: ProviderProps): JSX.Element {
    const value = useAuthInternal()
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuthInternal(): AuthResult {
    const { dispatch } = useAppState()
    const [authToken, setAuthToken] = React.useState<AuthToken | undefined>(
        getFromStorage(AUTH_FILE),
    )

    const updateAuthToken = React.useCallback(function updateAuthToken(authToken?: AuthToken) {
        if (authToken) {
            saveToStorage(AUTH_FILE, authToken)
            setAuthToken(authToken)
        } else {
            removeFromStorage(AUTH_FILE)
            setAuthToken(undefined)
        }
    }, [])

    const logOut = React.useCallback(
        function logOut() {
            updateAuthToken(undefined)
            dispatch({ type: 'delete-user' })
        },
        [dispatch, updateAuthToken],
    )

    const updateAuthDetails = React.useCallback(
        function updateAuthDetails(details: AuthDetails) {
            const { authToken } = details
            updateAuthToken(authToken)
        },
        [updateAuthToken],
    )

    return {
        isAuthenticated: Boolean(authToken),
        authToken: authToken,
        updateAuthToken,
        logOut,
        updateAuthDetails,
    }
}

function useAuth(): AuthResult {
    return React.useContext(AuthContext)
}

export { AuthProvider, useAuth }
