import * as React from 'react'
import type {
    League,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
} from '@webowl/apiclient'
import { makeCall, makeCallWithValue, Result, ResultWith } from '../utils/result-utils'
import { useApiClient } from '.'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { actions } from '../reducers/actions'

type LeagueManagementResult = {
    busy: boolean
    getLeagues: () => Promise<ResultWith<LeaguesResponse>>
    addLeague: (league: Omit<League, 'id' | 'createdById'>) => Promise<ResultWith<LeagueResponse>>
    getLeagueUsers: (leagueId?: number) => Promise<ResultWith<LeagueUsersResponse>>
    sendUserInvite: (leagueId: number, emailAddress: string) => Promise<Result>
    acceptUserInvite: (inviteCode: string) => Promise<ResultWith<LeagueResponse>>
}

function useLeagueManagement(): LeagueManagementResult {
    const [busy, setBusy] = React.useState(false)
    const { apiClient } = useApiClient()
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
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
        async function getLeagueUsers(leagueId?: number): Promise<ResultWith<LeagueUsersResponse>> {
            if (!authenticatedUser || !leagueId) return { type: 'idle' }
            const response = await makeCallWithValue(() => apiClient.getLeagueUsers(leagueId))
            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeagueUsers({ leagueId, users: response.value.users }))
            }
            return response
        },
        [apiClient, authenticatedUser, dispatch],
    )
    const sendUserInvite = React.useCallback(
        function sendUserInvite(leagueId: number, emailAddress: string) {
            return makeCall(() => apiClient.sendLeagueInvite(leagueId, { emailAddress }), setBusy)
        },
        [apiClient],
    )

    const acceptUserInvite = React.useCallback(
        async function acceptUserInvite(inviteCode: string) {
            const response = await makeCallWithValue(
                () => apiClient.acceptLeagueInvite({ inviteCode }),
                setBusy,
            )

            if (response.type === 'success') {
                dispatch(actions.addOrUpdateLeague(response.value.league))
                const users = await getLeagueUsers(response.value.league.id)
                if (users.type === 'success') {
                    dispatch(
                        actions.addOrUpdateLeagueUsers({
                            leagueId: response.value.league.id,
                            users: users.value.users,
                        }),
                    )
                }
            }

            return response
        },
        [apiClient, dispatch, getLeagueUsers],
    )

    return {
        busy,
        getLeagues,
        addLeague,
        getLeagueUsers,
        sendUserInvite,
        acceptUserInvite,
    }
}

export { useLeagueManagement }
