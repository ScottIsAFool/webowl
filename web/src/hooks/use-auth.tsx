import * as React from 'react'
import { AuthToken, User } from '@webowl/apiclient'
import { WithChildren } from '../types'
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
    logOut: () => void
}

type ProviderProps = WithChildren

const AuthContext = React.createContext<AuthResult>({
    isAuthenticated: false,
    updateAuthToken: () => undefined,
    logOut: () => undefined,
})

function AuthProvider({ children }: ProviderProps): JSX.Element {
    const value = useAuthInternal()
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuthInternal(): AuthResult {
    const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(
        getFromStorage(AUTH_FILE),
    )

    const updateAuthToken = React.useCallback(
        function updateAuthToken(authToken?: AuthToken) {
            if (authToken) {
                saveToStorage(AUTH_FILE, authToken)
                setAuthDetails({
                    ...authDetails,
                    authToken,
                })
            } else {
                removeFromStorage(AUTH_FILE)
                setAuthDetails(undefined)
            }
        },
        [authDetails],
    )

    const logOut = React.useCallback(
        function logOut() {
            updateAuthToken(undefined)
        },
        [updateAuthToken],
    )
    return {
        isAuthenticated: Boolean(authDetails),
        authToken: authDetails?.authToken,
        authenticatedUser: authDetails?.user,
        updateAuthToken,
        logOut,
    }
}

function useAuth(): AuthResult {
    return React.useContext(AuthContext)
}

export { AuthProvider, useAuth }
