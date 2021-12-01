import * as React from 'react'
import type { AuthToken } from '@webowl/apiclient'
import type { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'

const AUTH_FILE = 't.json'

type AuthResult = {
    isAuthenticated: boolean
    authToken?: AuthToken
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

    const logOut = React.useCallback(function logOut() {
        localStorage.clear()
        window.location.href = '/'
    }, [])

    return {
        isAuthenticated: Boolean(authToken),
        authToken: authToken,
        updateAuthToken,
        logOut,
    }
}

function useAuth(): AuthResult {
    return React.useContext(AuthContext)
}

export { AuthProvider, useAuth }
