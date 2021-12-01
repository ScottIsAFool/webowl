import * as React from 'react'
import type { League, LeagueResponse, LeaguesResponse } from '@webowl/apiclient'
import { makeCallWithValue, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'
import { useAppDispatch } from '../reducers/hooks'
import { actions } from '../reducers/actions'

type LeagueManagementResult = {
    busy: boolean
    getLeagues: () => Promise<ResultWith<LeaguesResponse>>
    addLeague: (league: Omit<League, 'id' | 'createdById'>) => Promise<ResultWith<LeagueResponse>>
}

function useLeagueManagement(): LeagueManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const dispatch = useAppDispatch()
    const getLeagues = React.useCallback(
        function getLeagues() {
            return makeCallWithValue(() => apiClient.getLeagues(), setBusy)
        },
        [apiClient],
    )

    const addLeague = React.useCallback(
        async function addLeague(league: Omit<League, 'id' | 'createdById'>) {
            const response = await makeCallWithValue(() => apiClient.addLeague(league), setBusy)
            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeague(response.value.league))
            }

            return response
        },
        [apiClient, dispatch],
    )
    return {
        busy,
        getLeagues,
        addLeague,
    }
}

export { useLeagueManagement }
