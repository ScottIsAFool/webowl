import { ApiClient } from '@webowl/apiclient'
import * as React from 'react'
import { useAuth } from '.'
import { getConfiguration } from '../config/configuration'

const baseURL = getConfiguration().baseUrl

type ApiClientResult = {
    apiClient: ApiClient
}

function useApiClient(): ApiClientResult {
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

export { useApiClient }
