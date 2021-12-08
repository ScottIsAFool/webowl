import * as React from 'react'

import { actions } from '../reducers/actions'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { makeCallWithValue, ResultWith } from '../utils/result-utils'

import { useApiClient } from '.'

import type { User, UserResponse } from '@webowl/apiclient'
import type { WithChildren } from '../types'

type UserManagementResult = {
    busy: boolean
    authenticatedUser?: User | null
    updateUser: (user?: User) => void
    refreshAuthenticatedUser: () => void
    getAuthenticatedUser: () => Promise<ResultWith<UserResponse>>
}

type ProviderProps = WithChildren

const UserContext = React.createContext<UserManagementResult>({
    busy: false,
    updateUser: () => undefined,
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
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
    const dispatch = useAppDispatch()

    const updateUser = React.useCallback(
        function updateUser(user?: User) {
            dispatch(actions.addOrUpdateUser(user))
        },
        [dispatch],
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
        getAuthenticatedUser,
        refreshAuthenticatedUser,
    }
}

function useUserManagement(): UserManagementResult {
    return React.useContext(UserContext)
}

export { UserProvider, useUserManagement }
