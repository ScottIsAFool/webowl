import * as React from 'react'

import { ApiClient } from '@webowl/apiclient'

import { getConfiguration } from '../config/configuration'

import { useAuth } from '.'

import type { WithChildren } from '../types'

const baseURL = getConfiguration().baseUrl

type ApiClientResult = {
    apiClient: ApiClient
}

const ApiClientContext = React.createContext<ApiClientResult>({} as ApiClientResult)

function ApiClientProvider({ children }: WithChildren): JSX.Element {
    const value = useApiClientInternal()
    return <ApiClientContext.Provider value={value}>{children}</ApiClientContext.Provider>
}

function useApiClientInternal(): ApiClientResult {
    const { authToken, updateAuthToken } = useAuth()
    const apiClient = React.useMemo(() => {
        const client = new ApiClient(baseURL, authToken)
        client.onTokenRefresh = updateAuthToken
        return client
    }, [authToken, updateAuthToken])
    return {
        apiClient,
    }
}

function useApiClient(): ApiClientResult {
    return React.useContext(ApiClientContext)
}

export { ApiClientProvider, useApiClient }
