import * as React from 'react'
import type { LeaguesResponse } from '@webowl/apiclient'
import { makeCallWithValue, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'

type LeagueManagementResult = {
    busy: boolean
    getLeagues: () => Promise<ResultWith<LeaguesResponse>>
}

function useLeagueManagement(): LeagueManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const getLeagues = React.useCallback(
        function getLeagues() {
            return makeCallWithValue(() => apiClient.getLeagues(), setBusy)
        },
        [apiClient],
    )
    return {
        busy,
        getLeagues,
    }
}

export { useLeagueManagement }
