import * as React from 'react'
import type {
    League,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
} from '@webowl/apiclient'
import { makeCallWithValue, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'
import { useAppDispatch } from '../reducers/hooks'
import { actions } from '../reducers/actions'

type LeagueManagementResult = {
    busy: boolean
    getLeagues: () => Promise<ResultWith<LeaguesResponse>>
    addLeague: (league: Omit<League, 'id' | 'createdById'>) => Promise<ResultWith<LeagueResponse>>
    getLeagueUsers: (leagueId: number) => Promise<ResultWith<LeagueUsersResponse>>
}

function useLeagueManagement(): LeagueManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const dispatch = useAppDispatch()
    const getLeagues = React.useCallback(
        function getLeagues() {
            return makeCallWithValue(async () => {
                const response = await apiClient.getLeagues()
                dispatch(actions.mergeLeagues(response.leagues))
                return response
            }, setBusy)
        },
        [apiClient, dispatch],
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

    const getLeagueUsers = React.useCallback(
        async function getLeagueUsers(leagueId: number) {
            const response = await makeCallWithValue(() => apiClient.getLeagueUsers(leagueId))
            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeagueUsers({ leagueId, users: response.value.users }))
            }
            return response
        },
        [apiClient, dispatch],
    )

    return {
        busy,
        getLeagues,
        addLeague,
        getLeagueUsers,
    }
}

export { useLeagueManagement }
