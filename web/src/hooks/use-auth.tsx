import * as React from 'react'
import { AuthToken } from '@webowl/apiclient'
import { WithChildren } from '../types'
import { getFromStorage, removeFromStorage, saveToStorage } from '../utils/storage-utils'

const AUTH_FILE = 't.json'

type AuthResult = {
    isAuthenticated: boolean
    authToken?: AuthToken
    updateAuthToken: (token: AuthToken) => void
}

type ProviderProps = WithChildren

const AuthContext = React.createContext<AuthResult>({
    isAuthenticated: false,
    updateAuthToken: () => undefined,
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
        setAuthToken(authToken)
        if (authToken) {
            saveToStorage(AUTH_FILE, authToken)
        } else {
            removeFromStorage(AUTH_FILE)
        }
    }, [])
    return {
        isAuthenticated: Boolean(authToken),
        updateAuthToken,
    }
}

function useAuth(): AuthResult {
    return React.useContext(AuthContext)
}

export { AuthProvider, useAuth }
