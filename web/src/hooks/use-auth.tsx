import * as React from 'react'
import type { AuthToken, User } from '@webowl/apiclient'
import type { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'

const AUTH_FILE = 't.json'

type AuthDetails = {
    authToken?: AuthToken
    user?: User
}

type AuthResult = {
    isAuthenticated: boolean
    authToken?: AuthToken
    authenticatedUser?: User
    updateAuthToken: (token: AuthToken) => void
    updateAuthDetails: (details: AuthDetails) => void
    logOut: () => void
    setVerified: (value: boolean) => void
}

type ProviderProps = WithChildren

const AuthContext = React.createContext<AuthResult>({
    isAuthenticated: false,
    updateAuthToken: () => undefined,
    updateAuthDetails: () => undefined,
    logOut: () => undefined,
    setVerified: () => undefined,
})

function AuthProvider({ children }: ProviderProps): JSX.Element {
    const value = useAuthInternal()
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuthInternal(): AuthResult {
    const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(
        getFromStorage(AUTH_FILE),
    )

    const updateAuthDetails = React.useCallback(function updateAuthDetails(
        authDetails?: AuthDetails,
    ) {
        if (authDetails) {
            saveToStorage(AUTH_FILE, authDetails)
            setAuthDetails(authDetails)
        } else {
            removeFromStorage(AUTH_FILE)
            setAuthDetails(undefined)
        }
    },
    [])

    const updateAuthToken = React.useCallback(
        function updateAuthToken(authToken?: AuthToken) {
            if (authToken) {
                updateAuthDetails({
                    ...authDetails,
                    authToken,
                })
            } else {
                updateAuthDetails(undefined)
            }
        },
        [authDetails, updateAuthDetails],
    )

    const logOut = React.useCallback(
        function logOut() {
            updateAuthToken(undefined)
        },
        [updateAuthToken],
    )

    const setVerified = React.useCallback(
        function setVerified(value: boolean) {
            if (!authDetails?.user) return
            updateAuthDetails({
                ...authDetails,
                user: {
                    ...authDetails.user,
                    verified: value,
                },
            })
        },
        [authDetails, updateAuthDetails],
    )
    return {
        isAuthenticated: Boolean(authDetails),
        authToken: authDetails?.authToken,
        authenticatedUser: authDetails?.user,
        updateAuthToken,
        updateAuthDetails,
        logOut,
        setVerified,
    }
}

function useAuth(): AuthResult {
    return React.useContext(AuthContext)
}

export { AuthProvider, useAuth }
